export const getTusdtBalance = `import FungibleToken from 0xFungibleToken

import TeleportedTetherToken from 0xTeleportedTetherToken

// This script returns an account's Elvn balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(TeleportedTetherToken.TokenPublicBalancePath)
        .borrow<&TeleportedTetherToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
`;
