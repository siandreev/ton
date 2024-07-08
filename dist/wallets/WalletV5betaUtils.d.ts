/// <reference types="node" />
import { Builder, OutActionSendMsg, Slice } from '@ton/core';
import { OutActionExtended } from "./WalletV5Utils";
export declare function storeOutActionExtendedV5Beta(action: OutActionExtended): (builder: Builder) => void;
export declare function loadOutActionV5BetaExtended(slice: Slice): OutActionExtended;
export declare function storeOutListExtendedV5Beta(actions: (OutActionExtended | OutActionSendMsg)[]): (builder: Builder) => void;
export declare function loadOutListExtendedV5Beta(slice: Slice): (OutActionExtended | OutActionSendMsg)[];
export interface WalletIdV5Beta {
    readonly walletVersion: 'v5';
    /**
     * -239 is mainnet, -3 is testnet
     */
    readonly networkGlobalId: number;
    readonly workChain: number;
    readonly subwalletNumber: number;
}
export declare function loadWalletIdV5Beta(value: bigint | Buffer | Slice): WalletIdV5Beta;
export declare function storeWalletIdV5Beta(walletId: WalletIdV5Beta): (builder: Builder) => void;
