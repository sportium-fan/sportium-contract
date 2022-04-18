import FungibleToken from "../../contracts/FungibleToken.cdc"

import FUSD from "../../contracts/FUSD.cdc"

transaction {
  prepare(account: AuthAccount) {
      if account.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
        account.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

        account.link<&FUSD.Vault{FungibleToken.Receiver}>(
          /public/fusdReceiver,
          target: /storage/fusdVault
        )

        account.link<&FUSD.Vault{FungibleToken.Balance}>(
          /public/fusdBalance,
          target: /storage/fusdVault
        )
    }
  }
}
