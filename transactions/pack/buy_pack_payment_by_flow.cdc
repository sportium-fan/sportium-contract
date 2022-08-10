import FungibleToken from "../../contracts/std/FungibleToken.cdc"
import FlowToken from "../../contracts/std/FlowToken.cdc"
import FUSD from "../../contracts/std/FUSD.cdc"

import FlowSwapPair from "../../contracts/blocto/FlowSwapPair.cdc"
import FusdUsdtSwapPair from "../../contracts/blocto/FusdUsdtSwapPair.cdc"

import Elvn from "../../contracts/sprt/Elvn.cdc"
import ElvnFUSDTreasury from "../../contracts/sprt/ElvnFUSDTreasury.cdc"
import Pack from "../../contracts/sprt/Pack.cdc"

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

	let elvnVault: @Elvn.Vault

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

		if fusdVault.balance > elvnPrice {
			let remainVault <- fusdVault.withdraw(amount: fusdVault.balance - elvnPrice) as! @FUSD.Vault
			
			let tUSDTVault <- FusdUsdtSwapPair.swapToken1ForToken2(from: <-remainVault)
			let flowVault <- FlowSwapPair.swapToken2ForToken1(from: <- tUSDTVault)
			
			flowTokenVault.deposit(from: <- flowVault)
		}

		self.elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault) as! @Elvn.Vault
    }

    execute {
		self.collection
			.deposit(
				token: <- Pack.buyPack(releaseId: releaseId, vault: <- self.elvnVault)
			)
    }
}
