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
import { ExternallySingedAuthWallet3SendArgs, SingedAuthWallet3SendArgs } from "./WalletContractV3";
export declare class WalletContractV3R1 implements Contract {
    static create(args: {
        workchain: number;
        publicKey: Buffer;
        walletId?: Maybe<number>;
    }): WalletContractV3R1;
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
     * Get wallet balance
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
     * Create transfer
     */
    createTransfer(args: SingedAuthWallet3SendArgs): Cell;
    /**
     * Create asynchronously signed request
     */
    createTransferAndSignRequestAsync(args: ExternallySingedAuthWallet3SendArgs): Promise<Cell>;
    /**
     * Create sender
     */
    sender(provider: ContractProvider, secretKey: Buffer): Sender;
}
