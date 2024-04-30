/// <reference types="node" />
import { Address, Builder, OutActionSendMsg, Slice } from '@ton/core';
export interface OutActionAddExtension {
    type: 'addExtension';
    address: Address;
}
export interface OutActionRemoveExtension {
    type: 'removeExtension';
    address: Address;
}
export interface OutActionSetIsPublicKeyEnabled {
    type: 'setIsPublicKeyEnabled';
    isEnabled: boolean;
}
export type OutActionExtended = OutActionSetIsPublicKeyEnabled | OutActionAddExtension | OutActionRemoveExtension;
export declare function storeOutActionExtended(action: OutActionExtended): (builder: Builder) => void;
export declare function loadOutActionExtended(slice: Slice): OutActionExtended;
export declare function isOutActionExtended(action: OutActionSendMsg | OutActionExtended): action is OutActionExtended;
export declare function storeOutListExtended(actions: (OutActionExtended | OutActionSendMsg)[]): (builder: Builder) => void;
export declare function loadOutListExtended(slice: Slice): (OutActionExtended | OutActionSendMsg)[];
export interface WalletId {
    readonly walletVersion: 'v5';
    /**
     * -239 is mainnet, -3 is testnet
     */
    readonly networkGlobalId: number;
    readonly workChain: number;
    readonly subwalletNumber: number;
}
export declare function loadWalletId(value: bigint | Buffer | Slice): WalletId;
export declare function storeWalletId(walletId: WalletId): (builder: Builder) => void;
