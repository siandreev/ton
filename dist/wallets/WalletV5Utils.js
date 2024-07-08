"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOutActionBasic = exports.isOutActionExtended = void 0;
function isOutActionExtended(action) {
    return (action.type === 'setIsPublicKeyEnabled' || action.type === 'addExtension' || action.type === 'removeExtension');
}
exports.isOutActionExtended = isOutActionExtended;
function isOutActionBasic(action) {
    return !isOutActionExtended(action);
}
exports.isOutActionBasic = isOutActionBasic;
