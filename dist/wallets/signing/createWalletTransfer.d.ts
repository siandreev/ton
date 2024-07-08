/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { Builder, Cell, MessageRelaxed, OutActionSendMsg } from "@ton/core";
import { Maybe } from "../../utils/maybe";
import { ExternallySingedAuthWallet5BetaSendArgs, SingedAuthWallet5BetaSendArgs, WalletV5BetaBasicSendArgs } from "../WalletContractV5Beta";
import { ExternallySingedAuthWallet4SendArgs, SingedAuthWallet4SendArgs } from "../WalletContractV4";
import { ExternallySingedAuthWallet3SendArgs, SingedAuthWallet3SendArgs } from "../WalletContractV3";
import { OutActionExtended } from "../WalletV5Utils";
import { ExtensionAuthWallet5R1SendArgs, ExternallySingedAuthWallet5R1SendArgs, SingedAuthWallet5R1SendArgs } from "../WalletContractV5R1";
export declare function createWalletTransferV1(args: {
    seqno: number;
    sendMode: number;
    message: Maybe<MessageRelaxed>;
    secretKey: Buffer;
}): Cell;
export declare function createWalletTransferV2(args: {
    seqno: number;
    sendMode: number;
    messages: MessageRelaxed[];
    secretKey: Buffer;
    timeout?: Maybe<number>;
}): Cell;
export declare function createWalletTransferV3<T extends ExternallySingedAuthWallet3SendArgs | SingedAuthWallet3SendArgs>(args: T & {
    sendMode: number;
    walletId: number;
}): T extends ExternallySingedAuthWallet3SendArgs ? Promise<Cell> : Cell;
export declare function createWalletTransferV4<T extends ExternallySingedAuthWallet4SendArgs | SingedAuthWallet4SendArgs>(args: T & {
    sendMode: number;
    walletId: number;
}): T extends ExternallySingedAuthWallet4SendArgs ? Promise<Cell> : Cell;
export declare function createWalletTransferV5BetaExtensionAuth(args: WalletV5BetaBasicSendArgs & {
    actions: (OutActionSendMsg | OutActionExtended)[];
}): Cell;
export declare function createWalletTransferV5BetaSignedAuth<T extends ExternallySingedAuthWallet5BetaSendArgs | SingedAuthWallet5BetaSendArgs>(args: T & {
    actions: (OutActionSendMsg | OutActionExtended)[];
    walletId: (builder: Builder) => void;
}): T extends ExternallySingedAuthWallet5BetaSendArgs ? Promise<Cell> : Cell;
export declare function createWalletTransferV5R1ExtensionAuth(args: ExtensionAuthWallet5R1SendArgs & {
    actions: (OutActionSendMsg | OutActionExtended)[];
}): Cell;
export declare function createWalletTransferV5R1SignedAuth<T extends ExternallySingedAuthWallet5R1SendArgs | SingedAuthWallet5R1SendArgs>(args: T & {
    actions: (OutActionSendMsg | OutActionExtended)[];
    walletId: (builder: Builder) => void;
}): T extends ExternallySingedAuthWallet5R1SendArgs ? Promise<Cell> : Cell;
