import Elvn from "../../contracts/Elvn.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

// This script returns an account's Elvn balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(/public/elvnBalance)
        .borrow<&Elvn.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
