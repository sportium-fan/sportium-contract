export const swapElvnToFusd = `import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSD

import Elvn from 0xElvn
import ElvnFUSDTreasury from 0xElvnFUSDTreasury

transaction(amount: UFix64) {
    let fusdReceiver: &{FungibleToken.Receiver}
    let elvnVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {
        self.fusdReceiver =account 
            .getCapability(/public/fusdReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault) 
            ?? panic("Could not borrow reference to the owner's Vault!")

        self.elvnVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let elvnVault <- self.elvnVault as! @Elvn.Vault
        let fusdVault <- ElvnFUSDTreasury.swapElvnToFUSD(vault: <- elvnVault)

        self.fusdReceiver.deposit(from: <- fusdVault)
    }
}
`;
