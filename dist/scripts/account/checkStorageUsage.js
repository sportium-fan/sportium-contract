"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStorageUsage = void 0;
exports.checkStorageUsage = `pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)
    return [account.storageUsed, account.storageCapacity]
}
`;
