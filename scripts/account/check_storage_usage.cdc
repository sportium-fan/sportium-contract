pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)
    return [account.storageUsed, account.storageCapacity]
}
