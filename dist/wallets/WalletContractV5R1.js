"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContractV5R1 = void 0;
const core_1 = require("@ton/core");
const createWalletTransfer_1 = require("./signing/createWalletTransfer");
const WalletV5R1Utils_1 = require("./WalletV5R1Utils");
class WalletContractV5R1 {
    static create(args) {
        let workChain = 0;
        if ('workChain' in args && args.workChain != undefined) {
            workChain = args.workChain;
        }
        if (args.walletId?.context && (0, WalletV5R1Utils_1.isWalletIdV5R1ClientContext)(args.walletId.context) && args.walletId.context.workChain != undefined) {
            workChain = args.walletId.context.workChain;
        }
        return new WalletContractV5R1(workChain, args.publicKey, {
            networkGlobalId: args.walletId?.networkGlobalId ?? -239,
            context: args.walletId?.context ?? {
                workChain: 0,
                walletVersion: 'v5r1',
                subwalletNumber: 0
            }
        });
    }
    constructor(workChain, publicKey, walletId) {
        this.publicKey = publicKey;
        this.walletId = walletId;
        this.walletId = walletId;
        // https://github.com/ton-blockchain/wallet-contract-v5/blob/4fab977f4fae3a37c1aac216ed2b7e611a9bc2af/build/wallet_v5.compiled.json
        let code = core_1.Cell.fromBoc(Buffer.from('b5ee9c7241021401000281000114ff00f4a413f4bcf2c80b01020120020d020148030402dcd020d749c120915b8f6320d70b1f2082106578746ebd21821073696e74bdb0925f03e082106578746eba8eb48020d72101d074d721fa4030fa44f828fa443058bd915be0ed44d0810141d721f4058307f40e6fa1319130e18040d721707fdb3ce03120d749810280b99130e070e2100f020120050c020120060902016e07080019adce76a2684020eb90eb85ffc00019af1df6a2684010eb90eb858fc00201480a0b0017b325fb51341c75c875c2c7e00011b262fb513435c280200019be5f0f6a2684080a0eb90fa02c0102f20e011e20d70b1f82107369676ebaf2e08a7f0f01e68ef0eda2edfb218308d722028308d723208020d721d31fd31fd31fed44d0d200d31f20d31fd3ffd70a000af90140ccf9109a28945f0adb31e1f2c087df02b35007b0f2d0845125baf2e0855036baf2e086f823bbf2d0882292f800de01a47fc8ca00cb1f01cf16c9ed542092f80fde70db3cd81003f6eda2edfb02f404216e926c218e4c0221d73930709421c700b38e2d01d72820761e436c20d749c008f2e09320d74ac002f2e09320d71d06c712c2005230b0f2d089d74cd7393001a4e86c128407bbf2e093d74ac000f2e093ed55e2d20001c000915be0ebd72c08142091709601d72c081c12e25210b1e30f20d74a111213009601fa4001fa44f828fa443058baf2e091ed44d0810141d718f405049d7fc8ca0040048307f453f2e08b8e14038307f45bf2e08c22d70a00216e01b3b0f2d090e2c85003cf1612f400c9ed54007230d72c08248e2d21f2e092d200ed44d0d2005113baf2d08f54503091319c01810140d721d70a00f2e08ee2c8ca0058cf16c9ed5493f2c08de20010935bdb31e1d74cd0b4d6c35e', 'hex'))[0];
        let data = (0, core_1.beginCell)()
            .storeUint(1, 1) // is signature auth allowed
            .storeUint(0, 32) // Seqno
            .store((0, WalletV5R1Utils_1.storeWalletIdV5R1)(this.walletId))
            .storeBuffer(this.publicKey, 32)
            .storeBit(0) // Empty plugins dict
            .endCell();
        this.init = { code, data };
        this.address = (0, core_1.contractAddress)(workChain, { code, data });
    }
    /**
     * Get Wallet Balance
     */
    async getBalance(provider) {
        let state = await provider.getState();
        return state.balance;
    }
    /**
     * Get Wallet Seqno
     */
    async getSeqno(provider) {
        let state = await provider.getState();
        if (state.state.type === 'active') {
            let res = await provider.get('seqno', []);
            return res.stack.readNumber();
        }
        else {
            return 0;
        }
    }
    /**
     * Get Wallet Extensions
     */
    async getExtensions(provider) {
        let state = await provider.getState();
        if (state.state.type === 'active') {
            const result = await provider.get('get_extensions', []);
            return result.stack.readCellOpt();
        }
        else {
            return null;
        }
    }
    /**
     * Get Wallet Extensions
     */
    async getExtensionsArray(provider) {
        const extensions = await this.getExtensions(provider);
        if (!extensions) {
            return [];
        }
        const dict = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigUint(256), core_1.Dictionary.Values.BigInt(1), extensions);
        return dict.keys().map(addressHex => {
            const wc = this.address.workChain;
            return core_1.Address.parseRaw(`${wc}:${addressHex.toString(16).padStart(64, '0')}`);
        });
    }
    /**
     * Get is secret-key authentication enabled
     */
    async getIsSecretKeyAuthEnabled(provider) {
        let res = await provider.get('is_signature_allowed', []);
        return res.stack.readBoolean();
    }
    /**
     * Send signed transfer
     */
    async send(provider, message) {
        await provider.external(message);
    }
    /**
     * Sign and send transfer
     */
    async sendTransfer(provider, args) {
        const transfer = this.createTransfer(args);
        await this.send(provider, transfer);
    }
    /**
     * Sign and send add extension request
     */
    async sendAddExtension(provider, args) {
        const request = this.createAddExtension(args);
        await this.send(provider, request);
    }
    /**
     * Sign and send remove extension request
     */
    async sendRemoveExtension(provider, args) {
        const request = this.createRemoveExtension(args);
        await this.send(provider, request);
    }
    /**
     * Sign and send actions batch
     */
    async sendActionsBatch(provider, args) {
        const request = this.createActionsBatch(args);
        await this.send(provider, request);
    }
    createActions(args) {
        const actions = args.messages.map(message => ({ type: 'sendMsg', mode: args.sendMode, outMsg: message }));
        return actions;
    }
    /**
     * Create signed transfer
     */
    createTransfer(args) {
        const { messages, ...rest } = args;
        return this.createActionsBatch({
            ...rest,
            actions: this.createActions({ messages, sendMode: args.sendMode })
        });
    }
    /**
     * Create signed transfer async
     */
    createTransferAndSignRequestAsync(args) {
        const { messages, sendMode, ...rest } = args;
        return this.createAndSignRequestAsync({
            ...rest,
            actions: this.createActions({ messages, sendMode })
        });
    }
    /**
     * Create signed add extension request
     */
    createAddExtension(args) {
        const { extensionAddress, ...rest } = args;
        return this.createActionsBatch({
            actions: [{
                    type: 'addExtension',
                    address: extensionAddress
                }],
            ...rest
        });
    }
    /**
     * Create signed remove extension request
     */
    createRemoveExtension(args) {
        const { extensionAddress, ...rest } = args;
        return this.createActionsBatch({
            actions: [{
                    type: 'removeExtension',
                    address: extensionAddress
                }],
            ...rest
        });
    }
    /**
     * Create signed request or extension auth request
     */
    createActionsBatch(args) {
        if (args.authType === 'extension') {
            return (0, createWalletTransfer_1.createWalletTransferV5R1ExtensionAuth)(args);
        }
        return (0, createWalletTransfer_1.createWalletTransferV5R1SignedAuth)({
            ...args,
            walletId: (0, WalletV5R1Utils_1.storeWalletIdV5R1)(this.walletId)
        });
    }
    /**
     * Create asynchronously signed request
     */
    createAndSignRequestAsync(args) {
        return (0, createWalletTransfer_1.createWalletTransferV5R1SignedAuth)({
            ...args,
            walletId: (0, WalletV5R1Utils_1.storeWalletIdV5R1)(this.walletId)
        });
    }
    /**
     * Create sender
     */
    sender(provider, secretKey) {
        return {
            send: async (args) => {
                let seqno = await this.getSeqno(provider);
                let transfer = this.createTransfer({
                    seqno,
                    secretKey,
                    sendMode: args.sendMode ?? core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS,
                    messages: [(0, core_1.internal)({
                            to: args.to,
                            value: args.value,
                            init: args.init,
                            body: args.body,
                            bounce: args.bounce
                        })]
                });
                await this.send(provider, transfer);
            }
        };
    }
}
exports.WalletContractV5R1 = WalletContractV5R1;
WalletContractV5R1.OpCodes = {
    auth_extension: 0x6578746e,
    auth_signed_external: 0x7369676e,
    auth_signed_internal: 0x73696e74
};
