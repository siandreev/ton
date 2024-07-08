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
import { WalletIdV5R1, WalletIdV5R1ClientContext, WalletIdV5R1CustomContext } from "./WalletV5R1Utils";
export type WalletV5R1BasicSendArgs = {
    seqno: number;
    timeout?: Maybe<number>;
};
export type SingedAuthWallet5R1SendArgs = WalletV5R1BasicSendArgs & SingedAuthSendArgs & {
    authType?: 'external' | 'internal';
};
export type ExternallySingedAuthWallet5R1SendArgs = WalletV5R1BasicSendArgs & ExternallySingedAuthSendArgs & {
    authType?: 'external' | 'internal';
};
export type ExtensionAuthWallet5R1SendArgs = WalletV5R1BasicSendArgs & {
    authType: 'extension';
    queryId?: bigint;
};
export type WalletV5R1SendArgs = SingedAuthWallet5R1SendArgs | ExtensionAuthWallet5R1SendArgs;
export declare class WalletContractV5R1 implements Contract {
    readonly publicKey: Buffer;
    readonly walletId: WalletIdV5R1<WalletIdV5R1ClientContext | WalletIdV5R1CustomContext>;
    static OpCodes: {
        auth_extension: number;
        auth_signed_external: number;
        auth_signed_internal: number;
    };
    static create<C extends WalletIdV5R1ClientContext | WalletIdV5R1CustomContext>(args: C extends WalletIdV5R1ClientContext ? {
        walletId?: Maybe<WalletIdV5R1<C>>;
        publicKey: Buffer;
    } : {
        workChain?: number;
        publicKey: Buffer;
        walletId?: Maybe<Partial<WalletIdV5R1<C>>>;
    }): WalletContractV5R1;
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
    sendTransfer(provider: ContractProvider, args: WalletV5R1SendArgs & {
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Promise<void>;
    /**
     * Sign and send add extension request
     */
    sendAddExtension(provider: ContractProvider, args: WalletV5R1SendArgs & {
        extensionAddress: Address;
    }): Promise<void>;
    /**
     * Sign and send remove extension request
     */
    sendRemoveExtension(provider: ContractProvider, args: WalletV5R1SendArgs & {
        extensionAddress: Address;
    }): Promise<void>;
    /**
     * Sign and send actions batch
     */
    sendActionsBatch(provider: ContractProvider, args: WalletV5R1SendArgs & {
        actions: OutActionWalletV5[];
    }): Promise<void>;
    private createActions;
    /**
     * Create signed transfer
     */
    createTransfer(args: WalletV5R1SendArgs & {
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Cell;
    /**
     * Create signed transfer async
     */
    createTransferAndSignRequestAsync(args: ExternallySingedAuthWallet5R1SendArgs & {
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Promise<Cell>;
    /**
     * Create signed add extension request
     */
    createAddExtension(args: WalletV5R1SendArgs & {
        extensionAddress: Address;
    }): Cell;
    /**
     * Create signed remove extension request
     */
    createRemoveExtension(args: WalletV5R1SendArgs & {
        extensionAddress: Address;
    }): Cell;
    /**
     * Create signed request or extension auth request
     */
    createActionsBatch(args: WalletV5R1SendArgs & {
        actions: OutActionWalletV5[];
    }): Cell;
    /**
     * Create asynchronously signed request
     */
    createAndSignRequestAsync(args: ExternallySingedAuthWallet5R1SendArgs & {
        actions: OutActionWalletV5[];
    }): Promise<Cell>;
    /**
     * Create sender
     */
    sender(provider: ContractProvider, secretKey: Buffer): Sender;
}
