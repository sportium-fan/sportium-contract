export const setupAccount = `import FungibleToken from 0xFungibleToken

import FUSD from 0xFUSD

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
`;
