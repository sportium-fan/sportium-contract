export declare const checkStorageUsage = "pub fun main(address: Address): [UInt64] {\n    let account = getAccount(address)\n    return [account.storageUsed, account.storageCapacity]\n}\n";
