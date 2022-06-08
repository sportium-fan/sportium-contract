"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyPackPaymentByFusd = void 0;
exports.buyPackPaymentByFusd = `import FungibleToken from 0xstd/FungibleToken
import FUSD from 0xstd/FUSD

import Elvn from 0xsprt/Elvn
import ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury
import Pack from 0xsprt/Pack

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
