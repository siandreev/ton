"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeWalletId = exports.loadWalletId = exports.loadOutListExtended = exports.storeOutListExtended = exports.isOutActionExtended = exports.loadOutActionExtended = exports.storeOutActionExtended = void 0;
const core_1 = require("@ton/core");
const outActionSetIsPublicKeyEnabledTag = 0x20cbb95a;
function storeOutActionSetIsPublicKeyEnabled(action) {
    return (builder) => {
        builder.storeUint(outActionSetIsPublicKeyEnabledTag, 32).storeUint(action.isEnabled ? 1 : 0, 1);
    };
}
const outActionAddExtensionTag = 0x1c40db9f;
function storeOutActionAddExtension(action) {
    return (builder) => {
        builder.storeUint(outActionAddExtensionTag, 32).storeAddress(action.address);
    };
}
const outActionRemoveExtensionTag = 0x5eaef4a4;
function storeOutActionRemoveExtension(action) {
    return (builder) => {
        builder.storeUint(outActionRemoveExtensionTag, 32).storeAddress(action.address);
    };
}
function storeOutActionExtended(action) {
    switch (action.type) {
        case 'setIsPublicKeyEnabled':
            return storeOutActionSetIsPublicKeyEnabled(action);
        case 'addExtension':
            return storeOutActionAddExtension(action);
        case 'removeExtension':
            return storeOutActionRemoveExtension(action);
        default:
            throw new Error('Unknown action type' + action?.type);
    }
}
exports.storeOutActionExtended = storeOutActionExtended;
function loadOutActionExtended(slice) {
    const tag = slice.loadUint(32);
    switch (tag) {
        case outActionSetIsPublicKeyEnabledTag:
            return {
                type: 'setIsPublicKeyEnabled',
                isEnabled: !!slice.loadUint(1)
            };
        case outActionAddExtensionTag:
            return {
                type: 'addExtension',
                address: slice.loadAddress()
            };
        case outActionRemoveExtensionTag:
            return {
                type: 'removeExtension',
                address: slice.loadAddress()
            };
        default:
            throw new Error(`Unknown extended out action tag 0x${tag.toString(16)}`);
    }
}
exports.loadOutActionExtended = loadOutActionExtended;
function isOutActionExtended(action) {
    return (action.type === 'setIsPublicKeyEnabled' || action.type === 'addExtension' || action.type === 'removeExtension');
}
exports.isOutActionExtended = isOutActionExtended;
function storeOutListExtended(actions) {
    const [action, ...rest] = actions;
    if (!action || !isOutActionExtended(action)) {
        if (actions.some(isOutActionExtended)) {
            throw new Error("Can't serialize actions list: all extended actions must be placed before out actions");
        }
        return (builder) => {
            builder
                .storeUint(0, 1)
                .storeRef((0, core_1.beginCell)().store((0, core_1.storeOutList)(actions)).endCell());
        };
    }
    return (builder) => {
        builder.storeUint(1, 1)
            .store(storeOutActionExtended(action))
            .storeRef((0, core_1.beginCell)().store(storeOutListExtended(rest)).endCell());
    };
}
exports.storeOutListExtended = storeOutListExtended;
function loadOutListExtended(slice) {
    const actions = [];
    while (slice.loadUint(1)) {
        const action = loadOutActionExtended(slice);
        actions.push(action);
        slice = slice.loadRef().beginParse();
    }
    const commonAction = (0, core_1.loadOutList)(slice.loadRef().beginParse());
    if (commonAction.some(i => i.type === 'setCode')) {
        throw new Error("Can't deserialize actions list: only sendMsg actions are allowed for wallet v5");
    }
    return actions.concat(commonAction);
}
exports.loadOutListExtended = loadOutListExtended;
const walletVersionsSerialisation = {
    v5: 0
};
function loadWalletId(value) {
    const bitReader = new core_1.BitReader(new core_1.BitString(typeof value === 'bigint' ?
        Buffer.from(value.toString(16), 'hex') :
        value instanceof core_1.Slice ? value.loadBuffer(10) : value, 0, 80));
    const networkGlobalId = bitReader.loadInt(32);
    const workChain = bitReader.loadInt(8);
    const walletVersionRaw = bitReader.loadUint(8);
    const subwalletNumber = bitReader.loadUint(32);
    const walletVersion = Object.entries(walletVersionsSerialisation).find(([_, value]) => value === walletVersionRaw)?.[0];
    if (walletVersion === undefined) {
        throw new Error(`Can't deserialize walletId: unknown wallet version ${walletVersionRaw}`);
    }
    return { networkGlobalId, workChain, walletVersion, subwalletNumber };
}
exports.loadWalletId = loadWalletId;
function storeWalletId(walletId) {
    return (builder) => {
        builder.storeInt(walletId.networkGlobalId, 32);
        builder.storeInt(walletId.workChain, 8);
        builder.storeUint(walletVersionsSerialisation[walletId.walletVersion], 8);
        builder.storeUint(walletId.subwalletNumber, 32);
    };
}
exports.storeWalletId = storeWalletId;
