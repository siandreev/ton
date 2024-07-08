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
export type WalletV4BasicSendArgs = {
    seqno: number;
    messages: MessageRelaxed[];
    sendMode?: Maybe<SendMode>;
    timeout?: Maybe<number>;
};
export type SingedAuthWallet4SendArgs = WalletV4BasicSendArgs & SingedAuthSendArgs;
export type ExternallySingedAuthWallet4SendArgs = WalletV4BasicSendArgs & ExternallySingedAuthSendArgs;
export declare class WalletContractV4 implements Contract {
    static create(args: {
        workchain: number;
        publicKey: Buffer;
        walletId?: Maybe<number>;
    }): WalletContractV4;
    readonly workchain: number;
    readonly publicKey: Buffer;
    readonly address: Address;
    readonly walletId: number;
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
     * Send signed transfer
     */
    send(provider: ContractProvider, message: Cell): Promise<void>;
    /**
     * Sign and send transfer
     */
    sendTransfer(provider: ContractProvider, args: {
        seqno: number;
        secretKey: Buffer;
        messages: MessageRelaxed[];
        sendMode?: Maybe<SendMode>;
        timeout?: Maybe<number>;
    }): Promise<void>;
    /**
     * Create signed transfer
     */
    createTransfer(args: SingedAuthWallet4SendArgs): Cell;
    /**
     * Create asynchronously signed request
     */
    createTransferAndSignRequestAsync(args: ExternallySingedAuthWallet4SendArgs): Promise<Cell>;
    /**
     * Create sender
     */
    sender(provider: ContractProvider, secretKey: Buffer): Sender;
}
