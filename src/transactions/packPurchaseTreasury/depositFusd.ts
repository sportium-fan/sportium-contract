export const depositFusd = `import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSD
import ElvnFUSDTreasury from 0xElvnFUSDTreasury
import ElvnPackPurchaseTreasury from 0xElvnPackPurchaseTreasury

pub fun setupAccount(account: AuthAccount) {
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

pub fun swapFUSDToElvn(account: AuthAccount, amount: UFix64): @FungibleToken.Vault {
    let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) 
        ?? panic("Could not borrow reference to the owner's Vault!")
    let fusdVault <- vaultRef.withdraw(amount: amount) as! @FUSD.Vault

    return <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)
}

transaction(amount: UFix64) {
  // The Vault resource that holds the tokens that are being transfered
  let depositVault: @FungibleToken.Vault

  prepare(account: AuthAccount) {
      setupAccount(account: account)

        // Withdraw tokens from the account's stored vault
      self.depositVault <- swapFUSDToElvn(account: account, amount: amount)
    }

    execute {
        ElvnPackPurchaseTreasury.depositElvn(vault: <- self.depositVault)
    }
}
 `;
