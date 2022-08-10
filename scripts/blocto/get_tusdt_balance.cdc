import FungibleToken from "../../contracts/std/FungibleToken.cdc"

import TeleportedTetherToken from "../../contracts/blocto/TeleportedTetherToken.cdc"

// This script returns an account's Elvn balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(TeleportedTetherToken.TokenPublicBalancePath)
        .borrow<&TeleportedTetherToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
