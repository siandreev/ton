/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { Address, Cell, Contract, ContractProvider, MessageRelaxed, Sender, SendMode } from "@ton/core";
import { Maybe } from "../utils/maybe";
import { ExternallySingedAuthSendArgs, SingedAuthSendArgs } from "./signing/singer";
import { OutActionWalletV5 } from "./WalletV5Utils";
import { WalletIdV5Beta } from "./WalletV5betaUtils";
export type WalletV5BetaBasicSendArgs = {
    seqno: number;
    timeout?: Maybe<number>;
};
export type SingedAuthWallet5BetaSendArgs = WalletV5BetaBasicSendArgs & SingedAuthSendArgs & {
    authType?: 'external' | 'internal';
};
export type ExternallySingedAuthWallet5BetaSendArgs = WalletV5BetaBasicSendArgs & ExternallySingedAuthSendArgs & {
    authType?: 'external' | 'internal';
};
export type ExtensionAuthWallet5SendArgs = WalletV5BetaBasicSendArgs & {
    authType: 'extension';
};
export type Wallet5SendArgs = SingedAuthWallet5BetaSendArgs | ExtensionAuthWallet5SendArgs;
/**
 * @deprecated
 * use WalletContractV5R1 instead
 */
export declare class WalletContractV5Beta implements Contract {
    readonly walletId: WalletIdV5Beta;
    readonly publicKey: Buffer;
    static OpCodes: {
        auth_extension: number;
        auth_signed_external: number;
        auth_signed_internal: number;
    };
    static create(args: {
        walletId?: Partial<WalletIdV5Beta>;
        publicKey: Buffer;
    }): WalletContractV5Beta;
    readonly address: Address;
    readonly init: {
        data: Cell;
        code: Cell;
    };
    private constructor();
    /**
     * Get Wallet Balance
     */
    getBalance(provider: ContractProvider): Promise<bigint>;
    /**
     * Get Wallet Seqno
     */
    getSeqno(provider: ContractProvider): Promise<number>;
    /**
     * Get Wallet Extensions
     */
    getExtensions(provider: ContractProvider): Promise<Cell | null>;
    /**
     * Get Wallet Extensions
     */
    getExtensionsArray(provider: ContractProvider): Promise<Address[]>;
    /**
     * Get is secret-key authentication enabled
     */
    getIsSecretKeyAuthEnabled(provider: ContractProvider): Promise<boolean>;
    /**
     * Send signed transfer
     */
    send(provider: ContractProvider, message: Cell): Promise<void>;
    /**
     * Sign and send transfer
     */
    sendTransfer(provider: ContractProvider, args: Wallet5SendArgs & {
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Promise<void>;
    /**
     * Sign and send add extension request
     */
    sendAddExtension(provider: ContractProvider, args: Wallet5SendArgs & {
        extensionAddress: Address;
    }): Promise<void>;
    /**
     * Sign and send remove extension request
     */
    sendRemoveExtension(provider: ContractProvider, args: Wallet5SendArgs & {
        extensionAddress: Address;
    }): Promise<void>;
    /**
     * Sign and send actions batch
     */
    sendActionsBatch(provider: ContractProvider, args: Wallet5SendArgs & {
        actions: OutActionWalletV5[];
    }): Promise<void>;
    private createActions;
    /**
     * Create signed transfer
     */
    createTransfer(args: Wallet5SendArgs & {
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Cell;
    /**
     * Create signed transfer async
     */
    createTransferAndSignRequestAsync(args: ExternallySingedAuthWallet5BetaSendArgs & {
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Promise<Cell>;
    /**
     * Create signed add extension request
     */
    createAddExtension(args: Wallet5SendArgs & {
        extensionAddress: Address;
    }): Cell;
    /**
     * Create signed remove extension request
     */
    createRemoveExtension(args: Wallet5SendArgs & {
        extensionAddress: Address;
    }): Cell;
    /**
     * Create signed request or extension auth request
     */
    createActionsBatch(args: Wallet5SendArgs & {
        actions: OutActionWalletV5[];
    }): Cell;
    /**
     * Create asynchronously signed request
     */
    createAndSignRequestAsync(args: ExternallySingedAuthWallet5BetaSendArgs & {
        actions: OutActionWalletV5[];
    }): Promise<Cell>;
    /**
     * Create sender
     */
    sender(provider: ContractProvider, secretKey: Buffer): Sender;
}
