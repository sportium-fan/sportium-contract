export const buyPackPaymentByFusd = `import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSD

import Elvn from 0xElvn
import ElvnFUSDTreasury from 0xElvnFUSDTreasury
import Pack from 0xPack

pub fun swapFUSDToElvn(account: AuthAccount, amount: UFix64): @FungibleToken.Vault {
    let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) 
        ?? panic("Could not borrow reference to the owner's Vault!")
    let fusdVault <- vaultRef.withdraw(amount: amount) as! @FUSD.Vault

    return <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)
}

transaction(releaseId: UInt64) {
    let collection: &Pack.Collection

	let vault: @Elvn.Vault

    prepare(account: AuthAccount) {
        let price = Pack.getPackPrice(releaseId: releaseId)

        self.vault <- swapFUSDToElvn(account: account, amount: price) as! @Elvn.Vault
		self.collection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) 
			?? panic("Colud not borrow reference to the owner's Collection!")
    }

    execute {
		self.collection
			.deposit(
				token: <- Pack.buyPack(releaseId: releaseId, vault: <- self.vault)
			)
    }
}
`;
