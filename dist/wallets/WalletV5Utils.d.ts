import { Address, OutActionSendMsg } from '@ton/core';
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
export type OutActionWalletV5 = OutActionExtended | OutActionSendMsg;
export declare function isOutActionExtended(action: OutActionSendMsg | OutActionExtended): action is OutActionExtended;
export declare function isOutActionBasic(action: OutActionSendMsg | OutActionExtended): action is OutActionSendMsg;
