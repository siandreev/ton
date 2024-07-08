"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ton/core");
const WalletV5R1Utils_1 = require("./WalletV5R1Utils");
const mockMessageRelaxed1 = {
    info: {
        type: 'external-out',
        createdLt: 0n,
        createdAt: 0,
        dest: null,
        src: null
    },
    body: (0, core_1.beginCell)().storeUint(0, 8).endCell(),
    init: null
};
const mockMessageRelaxed2 = {
    info: {
        type: 'internal',
        ihrDisabled: true,
        bounce: false,
        bounced: false,
        dest: core_1.Address.parseRaw('0:' + '2'.repeat(64)),
        value: {
            coins: 1n
        },
        ihrFee: 1n,
        forwardFee: 1n,
        createdLt: 12345n,
        createdAt: 123456
    },
    body: (0, core_1.beginCell)().storeUint(0, 8).endCell(),
    init: null
};
const mockAddress = core_1.Address.parseRaw('0:' + '1'.repeat(64));
describe('Wallet V5R1 utils', () => {
    const outActionSetIsPublicKeyEnabledTag = 0x04;
    const outActionAddExtensionTag = 0x02;
    const outActionRemoveExtensionTag = 0x03;
    const outActionSendMsgTag = 0x0ec3c86d;
    it('Should serialise setIsPublicKeyEnabled action with true flag', () => {
        const action = (0, WalletV5R1Utils_1.storeOutActionExtendedV5R1)({
            type: 'setIsPublicKeyEnabled',
            isEnabled: true
        });
        const actual = (0, core_1.beginCell)().store(action).endCell();
        const expected = (0, core_1.beginCell)()
            .storeUint(outActionSetIsPublicKeyEnabledTag, 8)
            .storeBit(1)
            .endCell();
        expect(expected.equals(actual)).toBeTruthy();
    });
    it('Should serialise setIsPublicKeyEnabled action with false flag', () => {
        const action = (0, WalletV5R1Utils_1.storeOutActionExtendedV5R1)({
            type: 'setIsPublicKeyEnabled',
            isEnabled: false
        });
        const actual = (0, core_1.beginCell)().store(action).endCell();
        const expected = (0, core_1.beginCell)()
            .storeUint(outActionSetIsPublicKeyEnabledTag, 8)
            .storeBit(0)
            .endCell();
        expect(expected.equals(actual)).toBeTruthy();
    });
    it('Should serialise add extension action', () => {
        const action = (0, WalletV5R1Utils_1.storeOutActionExtendedV5R1)({
            type: 'addExtension',
            address: mockAddress
        });
        const actual = (0, core_1.beginCell)().store(action).endCell();
        const expected = (0, core_1.beginCell)()
            .storeUint(outActionAddExtensionTag, 8)
            .storeAddress(mockAddress)
            .endCell();
        expect(expected.equals(actual)).toBeTruthy();
    });
    it('Should serialise remove extension action', () => {
        const action = (0, WalletV5R1Utils_1.storeOutActionExtendedV5R1)({
            type: 'removeExtension',
            address: mockAddress
        });
        const actual = (0, core_1.beginCell)().store(action).endCell();
        const expected = (0, core_1.beginCell)()
            .storeUint(outActionRemoveExtensionTag, 8)
            .storeAddress(mockAddress)
            .endCell();
        expect(expected.equals(actual)).toBeTruthy();
    });
    it('Should serialise wallet id', () => {
        const walletId = {
            networkGlobalId: -239,
            context: {
                walletVersion: 'v5r1',
                workChain: 0,
                subwalletNumber: 0
            }
        };
        const actual = (0, core_1.beginCell)().store((0, WalletV5R1Utils_1.storeWalletIdV5R1)(walletId)).endCell();
        const context = (0, core_1.beginCell)()
            .storeUint(1, 1)
            .storeInt(walletId.context.workChain, 8)
            .storeUint(0, 8)
            .storeUint(walletId.context.subwalletNumber, 15)
            .endCell().beginParse().loadInt(32);
        const expected = (0, core_1.beginCell)().storeInt(BigInt(context) ^ BigInt(walletId.networkGlobalId), 32).endCell();
        expect(expected.equals(actual)).toBeTruthy();
    });
    it('Should deserialise wallet id', () => {
        const expected = {
            networkGlobalId: -239,
            context: {
                walletVersion: 'v5r1',
                workChain: 0,
                subwalletNumber: 0
            }
        };
        const context = (0, core_1.beginCell)()
            .storeUint(1, 1)
            .storeInt(expected.context.workChain, 8)
            .storeUint(0, 8)
            .storeUint(expected.context.subwalletNumber, 15)
            .endCell().beginParse().loadInt(32);
        const actual = (0, WalletV5R1Utils_1.loadWalletIdV5R1)((0, core_1.beginCell)().storeInt(BigInt(context) ^ BigInt(expected.networkGlobalId), 32).endCell().beginParse(), expected.networkGlobalId);
        expect(expected).toEqual(actual);
    });
    it('Should serialise wallet id', () => {
        const walletId = {
            networkGlobalId: -3,
            context: 239239239
        };
        const context = (0, core_1.beginCell)()
            .storeUint(0, 1)
            .storeUint(walletId.context, 31)
            .endCell().beginParse().loadInt(32);
        const actual = (0, core_1.beginCell)().store((0, WalletV5R1Utils_1.storeWalletIdV5R1)(walletId)).endCell();
        const expected = (0, core_1.beginCell)()
            .storeInt(BigInt(context) ^ BigInt(walletId.networkGlobalId), 32)
            .endCell();
        expect(expected.equals(actual)).toBeTruthy();
    });
    it('Should deserialise wallet id', () => {
        const expected = {
            networkGlobalId: -3,
            context: 239239239
        };
        const context = (0, core_1.beginCell)()
            .storeUint(0, 1)
            .storeUint(expected.context, 31)
            .endCell().beginParse().loadInt(32);
        const actual = (0, WalletV5R1Utils_1.loadWalletIdV5R1)((0, core_1.beginCell)()
            .storeInt(BigInt(context) ^ BigInt(expected.networkGlobalId), 32)
            .endCell().beginParse(), expected.networkGlobalId);
        expect(expected).toEqual(actual);
    });
    it('Should serialize extended out list', () => {
        const sendMode1 = core_1.SendMode.PAY_GAS_SEPARATELY;
        const isPublicKeyEnabled = false;
        const actions = [
            {
                type: 'addExtension',
                address: mockAddress
            },
            {
                type: 'setIsPublicKeyEnabled',
                isEnabled: isPublicKeyEnabled
            },
            {
                type: 'sendMsg',
                mode: sendMode1,
                outMsg: mockMessageRelaxed1
            }
        ];
        const actual = (0, core_1.beginCell)().store((0, WalletV5R1Utils_1.storeOutListExtendedV5R1)(actions)).endCell();
        const expected = (0, core_1.beginCell)()
            .storeUint(1, 1)
            .storeRef((0, core_1.beginCell)()
            .storeRef((0, core_1.beginCell)().endCell())
            .storeUint(outActionSendMsgTag, 32)
            .storeUint(sendMode1, 8)
            .storeRef((0, core_1.beginCell)().store((0, core_1.storeMessageRelaxed)(mockMessageRelaxed1)).endCell())
            .endCell())
            .storeUint(1, 1)
            .storeUint(outActionAddExtensionTag, 8)
            .storeAddress(mockAddress)
            .storeRef((0, core_1.beginCell)()
            .storeUint(outActionSetIsPublicKeyEnabledTag, 8)
            .storeBit(isPublicKeyEnabled ? 1 : 0)
            .endCell())
            .endCell();
        expect(actual.equals(expected)).toBeTruthy();
    });
    it('Should serialize extended out list and produce the expected boc', () => {
        const sendMode1 = core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS;
        const isPublicKeyEnabled = false;
        const actions = [
            {
                type: 'addExtension',
                address: mockAddress
            },
            {
                type: 'setIsPublicKeyEnabled',
                isEnabled: isPublicKeyEnabled
            },
            {
                type: 'sendMsg',
                mode: sendMode1,
                outMsg: mockMessageRelaxed1
            }
        ];
        const actual = (0, core_1.beginCell)().store((0, WalletV5R1Utils_1.storeOutListExtendedV5R1)(actions)).endCell();
        const expected = core_1.Cell.fromBoc(Buffer.from('b5ee9c72410105010046000245c0a000888888888888888888888888888888888888888888888888888888888888888c0104020a0ec3c86d0302030000001cc000000000000000000000000000000304409c06218f', 'hex'))[0];
        expect(actual.equals(expected)).toBeTruthy();
    });
    it('Should serialize extended out list and produce the expected boc for complex structures', () => {
        const sendMode1 = core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS;
        const sendMode2 = core_1.SendMode.NONE;
        const isPublicKeyEnabled = false;
        const actions = [
            {
                type: 'addExtension',
                address: mockAddress
            },
            {
                type: 'setIsPublicKeyEnabled',
                isEnabled: isPublicKeyEnabled
            },
            {
                type: 'removeExtension',
                address: mockAddress
            },
            {
                type: 'sendMsg',
                mode: sendMode1,
                outMsg: mockMessageRelaxed1
            },
            {
                type: 'sendMsg',
                mode: sendMode2,
                outMsg: mockMessageRelaxed2
            }
        ];
        const actual = (0, core_1.beginCell)().store((0, WalletV5R1Utils_1.storeOutListExtendedV5R1)(actions)).endCell();
        const expected = core_1.Cell.fromBoc(Buffer.from('b5ee9c724101080100ab000245c0a000888888888888888888888888888888888888888888888888888888888888888c0106020a0ec3c86d030205020a0ec3c86d00030400000068420011111111111111111111111111111111111111111111111111111111111111110808404404000000000000c0e40007890000001cc00000000000000000000000000001030440070045038002222222222222222222222222222222222222222222222222222222222222223037cc71d6', 'hex'))[0];
        expect(actual.equals(expected)).toBeTruthy();
    });
    it('Should deserialize extended out list', () => {
        const sendMode1 = core_1.SendMode.PAY_GAS_SEPARATELY;
        const isPublicKeyEnabled = true;
        const expected = [
            {
                type: 'sendMsg',
                mode: sendMode1,
                outMsg: mockMessageRelaxed1
            },
            {
                type: 'addExtension',
                address: mockAddress
            },
            {
                type: 'setIsPublicKeyEnabled',
                isEnabled: isPublicKeyEnabled
            }
        ];
        const serialized = (0, core_1.beginCell)()
            .storeUint(1, 1)
            .storeRef((0, core_1.beginCell)()
            .storeRef((0, core_1.beginCell)().endCell())
            .storeUint(outActionSendMsgTag, 32)
            .storeUint(sendMode1, 8)
            .storeRef((0, core_1.beginCell)().store((0, core_1.storeMessageRelaxed)(mockMessageRelaxed1)).endCell())
            .endCell())
            .storeUint(1, 1)
            .storeUint(outActionAddExtensionTag, 8)
            .storeAddress(mockAddress)
            .storeRef((0, core_1.beginCell)()
            .storeUint(outActionSetIsPublicKeyEnabledTag, 8)
            .storeBit(isPublicKeyEnabled ? 1 : 0)
            .endCell())
            .endCell();
        const actual = (0, WalletV5R1Utils_1.loadOutListExtendedV5R1)(serialized.beginParse());
        expect(expected.length).toEqual(actual.length);
        expected.forEach((item1, index) => {
            const item2 = actual[index];
            expect(item1.type).toEqual(item2.type);
            if (item1.type === 'sendMsg' && item2.type === 'sendMsg') {
                expect(item1.mode).toEqual(item2.mode);
                expect(item1.outMsg.body.equals(item2.outMsg.body)).toBeTruthy();
                expect(item1.outMsg.info).toEqual(item2.outMsg.info);
                expect(item1.outMsg.init).toEqual(item2.outMsg.init);
            }
            if (item1.type === 'addExtension' && item2.type === 'addExtension') {
                expect(item1.address.equals(item2.address)).toBeTruthy();
            }
            if (item1.type === 'setIsPublicKeyEnabled' && item2.type === 'setIsPublicKeyEnabled') {
                expect(item1.isEnabled).toEqual(item2.isEnabled);
            }
        });
    });
    it('Check toSaveSendMode: add + 2 to externals', () => {
        const notSafeSendMode = core_1.SendMode.PAY_GAS_SEPARATELY;
        const authType = 'external';
        const safeSendMode = (0, WalletV5R1Utils_1.toSafeV5R1SendMode)(notSafeSendMode, authType);
        expect(safeSendMode).toEqual(notSafeSendMode + core_1.SendMode.IGNORE_ERRORS);
    });
    it('Check toSaveSendMode: keep mode for internals', () => {
        const notSafeSendMode = core_1.SendMode.PAY_GAS_SEPARATELY;
        const authType = 'internal';
        const safeSendMode = (0, WalletV5R1Utils_1.toSafeV5R1SendMode)(notSafeSendMode, authType);
        expect(safeSendMode).toEqual(notSafeSendMode);
    });
    it('Check toSaveSendMode: keep mode for extensions', () => {
        const notSafeSendMode = core_1.SendMode.PAY_GAS_SEPARATELY;
        const authType = 'extension';
        const safeSendMode = (0, WalletV5R1Utils_1.toSafeV5R1SendMode)(notSafeSendMode, authType);
        expect(safeSendMode).toEqual(notSafeSendMode);
    });
    it("Check toSaveSendMode: don't add + 2 twice for externals", () => {
        const safeSendMode = core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS;
        const authType = 'external';
        const actualSafeSendMode = (0, WalletV5R1Utils_1.toSafeV5R1SendMode)(safeSendMode, authType);
        expect(actualSafeSendMode).toEqual(safeSendMode);
    });
    it("Check toSaveSendMode: don't add + 2 twice for internals", () => {
        const safeSendMode = core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS;
        const authType = 'internal';
        const actualSafeSendMode = (0, WalletV5R1Utils_1.toSafeV5R1SendMode)(safeSendMode, authType);
        expect(actualSafeSendMode).toEqual(safeSendMode);
    });
});
