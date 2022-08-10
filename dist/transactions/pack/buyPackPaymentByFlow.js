"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyPackPaymentByFlow = void 0;
exports.buyPackPaymentByFlow = `import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD

import FlowSwapPair from 0xFlowSwapPair
import FusdUsdtSwapPair from 0xFusdUsdtSwapPair

import Elvn from 0xElvn
import ElvnFUSDTreasury from 0xElvnFUSDTreasury
import Pack from 0xPack

// blocto swap route: fusd <-> tusdt <-> flow
pub fun getFUSDToFlowPrice(amount: UFix64): UFix64 {
	let quote0 = FusdUsdtSwapPair.quoteSwapExactToken1ForToken2(amount: amount * (1.0 - FusdUsdtSwapPair.getFeePercentage()))
  	let quote = FlowSwapPair.quoteSwapExactToken2ForToken1(amount: quote0 * (1.0 - FlowSwapPair.getFeePercentage()))
  	let poolAmounts0 = FlowSwapPair.getPoolAmounts()
	let currentPrice = (poolAmounts0.token1Amount / poolAmounts0.token2Amount) * (1.0 - FlowSwapPair.getFeePercentage())

	return currentPrice
}

transaction(releaseId: UInt64) {
    let collection: &Pack.Collection

    prepare(account: AuthAccount) {
		self.collection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) 
			?? panic("Colud not borrow reference to the owner's Pack Collection!");

		let flowTokenVault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) 
        	?? panic("Could not borrow reference to the owner's Flow Vault!");
        
        let elvnPrice = Pack.getPackPrice(releaseId: releaseId);
        
        let threshold = 1.01;
        let flowAmount = getFUSDToFlowPrice(amount: elvnPrice) * threshold;
        
        let flowVault <- flowTokenVault.withdraw(amount: flowAmount) as! @FlowToken.Vault;
        let tUSDTVault <- FlowSwapPair.swapToken1ForToken2(from: <- flowVault);
        let fusdVault <- FusdUsdtSwapPair.swapToken2ForToken1(from: <- tUSDTVault);

		let elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault) as! @Elvn.Vault
		let paymentVault <- elvnVault.withdraw(amount: elvnPrice) as! @Elvn.Vault

		self.collection
			.deposit(
				token: <- Pack.buyPack(releaseId: releaseId, vault: <- paymentVault)
			)

		if elvnVault.balance > 0.0 {
			let fusdVault <- ElvnFUSDTreasury.swapElvnToFUSD(vault: <- elvnVault) as! @FUSD.Vault
			let tUSDTVault <- FusdUsdtSwapPair.swapToken1ForToken2(from: <-fusdVault)
			let flowVault <- FlowSwapPair.swapToken2ForToken1(from: <- tUSDTVault)
			
			flowTokenVault.deposit(from: <- flowVault)
		} else {
			destroy elvnVault
		}
    }

    execute {
    }
}
`;
