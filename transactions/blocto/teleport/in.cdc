import FungibleToken from "../../../contracts/std/Fungibletoken.cdc"

import TeleportedTetherToken from "../../../contracts/blocto/TeleportedTetherToken.cdc" 

transaction(amount: UFix64, target: Address, from: String, hash: String) {
  prepare(teleportAdmin: AuthAccount) {
    let admin = teleportAdmin
        .borrow<&TeleportedTetherToken.Administrator>(from: /storage/teleportedTetherTokenAdmin)
        ?? panic("Could not borrow a reference to TeleportIn")

    let teleporter <- admin.createNewTeleportAdmin(allowedAmount: amount);
    
    let vault <- teleporter.teleportIn(amount: amount, from: from.decodeHex(), hash: hash)

    destroy teleporter

    let receiverRef = getAccount(target).getCapability(/public/teleportedTetherTokenReceiver)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow a reference to Receiver")

    receiverRef.deposit(from: <- (vault as! @FungibleToken.Vault))
  }
}
 