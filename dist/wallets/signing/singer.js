"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPayload = void 0;
const crypto_1 = require("@ton/crypto");
function signPayload(args, signingMessage, packMessage) {
    if ('secretKey' in args) {
        /**
         * Client provider an secretKey to sign transaction.
         */
        return packMessage((0, crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey), signingMessage);
    }
    else {
        /**
         * Client use external storage for secretKey.
         * In this case lib could create a request to external resource to sign transaction.
         */
        return args.signer(signingMessage.endCell())
            .then(signature => packMessage(signature, signingMessage));
    }
}
exports.signPayload = signPayload;
