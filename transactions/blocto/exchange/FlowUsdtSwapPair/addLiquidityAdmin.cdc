import FungibleToken from "../../../../contracts/std/FungibleToken.cdc" 
import FlowToken from "../../../../contracts/std/FlowToken.cdc"

import TeleportedTetherToken from "../../../../contracts/blocto/TeleportedTetherToken.cdc"
import FlowSwapPair from "../../../../contracts/blocto/FlowSwapPair.cdc" 

transaction(token1Amount: UFix64, token2Amount: UFix64) {
  let flowTokenVaultRef: &FlowToken.Vault
  let tetherVaultRef: &TeleportedTetherToken.Vault

  let admin: &FlowSwapPair.Admin
  let liquidityTokenRef: &FlowSwapPair.Vault

  prepare(signer: AuthAccount) {
    self.flowTokenVaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
        ?? panic("Could not borrow a reference to Vault")

    self.tetherVaultRef = signer.borrow<&TeleportedTetherToken.Vault>(from: /storage/teleportedTetherTokenVault)
        ?? panic("Could not borrow a reference to Vault")

	self.admin = signer.borrow<&FlowSwapPair.Admin>(from: /storage/flowSwapPairAdmin) 
		?? panic("Could not borrow a referene to Admin")
		
    if signer.borrow<&FlowSwapPair.Vault>(from: FlowSwapPair.TokenStoragePath) == nil {
      // Create a new flowToken Vault and put it in storage
      signer.save(<-FlowSwapPair.createEmptyVault(), to: FlowSwapPair.TokenStoragePath)

      // Create a public capability to the Vault that only exposes
      // the deposit function through the Receiver interface
      signer.link<&FlowSwapPair.Vault{FungibleToken.Receiver}>(
        FlowSwapPair.TokenPublicReceiverPath,
        target: FlowSwapPair.TokenStoragePath
      )

      // Create a public capability to the Vault that only exposes
      // the balance field through the Balance interface
      signer.link<&FlowSwapPair.Vault{FungibleToken.Balance}>(
        FlowSwapPair.TokenPublicBalancePath,
        target: FlowSwapPair.TokenStoragePath
      )
    }

    self.liquidityTokenRef = signer.borrow<&FlowSwapPair.Vault>(from: FlowSwapPair.TokenStoragePath)
      ?? panic("Could not borrow a reference to Vault")
  }

  execute {
    // Withdraw tokens
    let token1Vault <- self.flowTokenVaultRef.withdraw(amount: token1Amount) as! @FlowToken.Vault
    let token2Vault <- self.tetherVaultRef.withdraw(amount: token2Amount) as! @TeleportedTetherToken.Vault

    // Provide liquidity and get liquidity provider tokens
    let tokenBundle <- FlowSwapPair.createTokenBundle(fromToken1: <- token1Vault, fromToken2: <- token2Vault)
    let liquidityTokenVault <- self.admin.addInitialLiquidity(from: <- tokenBundle)

    // Keep the liquidity provider tokens
    self.liquidityTokenRef.deposit(from: <- liquidityTokenVault)
  }
}
