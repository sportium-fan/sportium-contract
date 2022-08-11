import FungibleToken from "../../contracts/std/FungibleToken.cdc"
import FlowToken from "../../contracts/std/FlowToken.cdc"
import FUSD from "../../contracts/std/FUSD.cdc"

import FlowSwapPair from "../../contracts/blocto/FlowSwapPair.cdc"
import FusdUsdtSwapPair from "../../contracts/blocto/FusdUsdtSwapPair.cdc"

import Elvn from "../../contracts/sprt/Elvn.cdc"
import ElvnFUSDTreasury from "../../contracts/sprt/ElvnFUSDTreasury.cdc"
import Pack from "../../contracts/sprt/Pack.cdc"

// blocto swap route: tusdt -> fusd -> flow
pub fun getTUSDTToFlowPrice(amount: UFix64): UFix64 {
  	let tusdtQuote = FlowSwapPair.quoteSwapToken1ForExactToken2(amount: amount * (1.0 + FlowSwapPair.getFeePercentage()))
	let fusdQuote = FusdUsdtSwapPair.quoteSwapExactToken2ForToken1(amount: tusdtQuote * (1.0 + FusdUsdtSwapPair.getFeePercentage()))

	return fusdQuote
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
        let flowAmount = getTUSDTToFlowPrice(amount: elvnPrice) * threshold;
        
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
