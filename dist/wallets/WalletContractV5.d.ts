/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { Address, Cell, Contract, ContractProvider, MessageRelaxed, OutActionSendMsg, Sender, SendMode } from "@ton/core";
import { Maybe } from "../utils/maybe";
import { OutActionExtended, WalletId } from "./WalletV5Utils";
import { ExternallySingedAuthSendArgs, SingedAuthSendArgs } from "./signing/singer";
export type Wallet5BasicSendArgs = {
    seqno: number;
    sendMode?: Maybe<SendMode>;
    timeout?: Maybe<number>;
};
export type SingedAuthWallet5SendArgs = Wallet5BasicSendArgs & SingedAuthSendArgs & {
    authType?: 'external' | 'internal';
};
export type ExternallySingedAuthWallet5SendArgs = Wallet5BasicSendArgs & ExternallySingedAuthSendArgs & {
    authType?: 'external' | 'internal';
};
export type ExtensionAuthWallet5SendArgs = Wallet5BasicSendArgs & {
    authType: 'extension';
};
export type Wallet5SendArgs = SingedAuthWallet5SendArgs | ExtensionAuthWallet5SendArgs;
export declare class WalletContractV5 implements Contract {
    readonly walletId: WalletId;
    readonly publicKey: Buffer;
    static opCodes: {
        auth_extension: number;
        auth_signed_external: number;
        auth_signed_internal: number;
    };
    static create(args: {
        walletId?: Partial<WalletId>;
        publicKey: Buffer;
    }): WalletContractV5;
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
     * Sign and send request
     */
    sendRequest(provider: ContractProvider, args: Wallet5SendArgs & {
        actions: (OutActionSendMsg | OutActionExtended)[];
    }): Promise<void>;
    private createActions;
    /**
     * Create signed transfer
     */
    createTransfer(args: Wallet5SendArgs & {
        messages: MessageRelaxed[];
    }): Cell;
    /**
     * Create signed transfer async
     */
    createTransferAndSignRequestAsync(args: ExternallySingedAuthWallet5SendArgs & {
        messages: MessageRelaxed[];
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
    createRequest(args: Wallet5SendArgs & {
        actions: (OutActionSendMsg | OutActionExtended)[];
    }): Cell;
    /**
     * Create asynchronously signed request
     */
    createAndSignRequestAsync(args: ExternallySingedAuthWallet5SendArgs & {
        actions: (OutActionSendMsg | OutActionExtended)[];
    }): Promise<Cell>;
    /**
     * Create sender
     */
    sender(provider: ContractProvider, secretKey: Buffer): Sender;
}
