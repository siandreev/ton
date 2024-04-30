"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContractV5 = void 0;
const core_1 = require("@ton/core");
const createWalletTransfer_1 = require("./signing/createWalletTransfer");
const WalletV5Utils_1 = require("./WalletV5Utils");
class WalletContractV5 {
    static create(args) {
        const walletId = {
            networkGlobalId: args.walletId?.networkGlobalId ?? -239,
            workChain: args?.walletId?.workChain ?? 0,
            subwalletNumber: args?.walletId?.subwalletNumber ?? 0,
            walletVersion: args?.walletId?.walletVersion ?? 'v5'
        };
        return new WalletContractV5(walletId, args.publicKey);
    }
    constructor(walletId, publicKey) {
        this.walletId = walletId;
        this.publicKey = publicKey;
        this.walletId = walletId;
        // Build initial code and data
        let code = core_1.Cell.fromBoc(Buffer.from('te6cckEBAQEAIwAIQgLkzzsvTG1qYeoPK1RH0mZ4WyavNjfbLe7mvNGqgm80Eg3NjhE=', 'base64'))[0];
        let data = (0, core_1.beginCell)()
            .storeInt(0, 33) // Seqno
            .store((0, WalletV5Utils_1.storeWalletId)(this.walletId))
            .storeBuffer(this.publicKey, 32)
            .storeBit(0) // Empty plugins dict
            .endCell();
        this.init = { code, data };
        this.address = (0, core_1.contractAddress)(this.walletId.workChain, { code, data });
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
        const dict = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigUint(256), core_1.Dictionary.Values.BigInt(8), extensions);
        return dict.keys().map(key => {
            const wc = dict.get(key);
            const addressHex = key ^ (wc + 1n);
            return core_1.Address.parseRaw(`${wc}:${addressHex.toString(16)}`);
        });
    }
    /**
     * Get is secret-key authentication enabled
     */
    async getIsSecretKeyAuthEnabled(provider) {
        let res = await provider.get('is_public_key_enabled', []);
        const result = res.stack.readNumber();
        return result !== 0;
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
     * Sign and send request
     */
    async sendRequest(provider, args) {
        const request = this.createRequest(args);
        await this.send(provider, request);
    }
    createActions(args) {
        const sendMode = args.sendMode ?? core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS;
        const actions = args.messages.map(message => ({ type: 'sendMsg', mode: sendMode, outMsg: message }));
        return actions;
    }
    /**
     * Create signed transfer
     */
    createTransfer(args) {
        const { messages, ...rest } = args;
        return this.createRequest({
            ...rest,
            actions: this.createActions({ messages, sendMode: args.sendMode })
        });
    }
    /**
     * Create signed transfer async
     */
    createTransferAndSignRequestAsync(args) {
        const { messages, ...rest } = args;
        return this.createAndSignRequestAsync({
            ...rest,
            actions: this.createActions({ messages, sendMode: args.sendMode })
        });
    }
    /**
     * Create signed add extension request
     */
    createAddExtension(args) {
        const { extensionAddress, ...rest } = args;
        return this.createRequest({
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
        return this.createRequest({
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
    createRequest(args) {
        if (args.authType === 'extension') {
            return (0, createWalletTransfer_1.createWalletTransferV5ExtensionAuth)({
                ...args,
                sendMode: args.sendMode ?? core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS,
                walletId: (0, WalletV5Utils_1.storeWalletId)(this.walletId)
            });
        }
        return (0, createWalletTransfer_1.createWalletTransferV5SignedAuth)({
            ...args,
            sendMode: args.sendMode ?? core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS,
            walletId: (0, WalletV5Utils_1.storeWalletId)(this.walletId)
        });
    }
    /**
     * Create asynchronously signed request
     */
    createAndSignRequestAsync(args) {
        return (0, createWalletTransfer_1.createWalletTransferV5SignedAuth)({
            ...args,
            sendMode: args.sendMode ?? core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS,
            walletId: (0, WalletV5Utils_1.storeWalletId)(this.walletId)
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
                    sendMode: args.sendMode,
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
exports.WalletContractV5 = WalletContractV5;
WalletContractV5.opCodes = {
    auth_extension: 0x6578746e,
    auth_signed_external: 0x7369676e,
    auth_signed_internal: 0x73696e74
};
