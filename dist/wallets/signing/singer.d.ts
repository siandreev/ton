/// <reference types="node" />
import { Builder, Cell } from "@ton/core";
export type SingedAuthSendArgs = {
    secretKey: Buffer;
};
export type ExternallySingedAuthSendArgs = {
    signer: (message: Cell) => Promise<Buffer>;
};
export declare function signPayload<T extends SingedAuthSendArgs | ExternallySingedAuthSendArgs>(args: T, signingMessage: Builder, packMessage: (signature: Buffer, signingMessage: Builder) => Cell): T extends ExternallySingedAuthSendArgs ? Promise<Cell> : Cell;
