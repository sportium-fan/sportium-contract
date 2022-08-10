"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseListingPaymentByFlow = void 0;
exports.purchaseListingPaymentByFlow = `import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD

import FlowSwapPair from 0xFlowSwapPair
import FusdUsdtSwapPair from 0xFusdUsdtSwapPair

import Elvn from 0xElvn
import ElvnFUSDTreasury from 0xElvnFUSDTreasury
import Moments from 0xMoments
import SprtNFTStorefront from 0xSprtNFTStorefront

// blocto swap route: fusd <-> tusdt <-> flow
pub fun getFUSDToFlowPrice(amount: UFix64): UFix64 {
	let quote0 = FusdUsdtSwapPair.quoteSwapExactToken1ForToken2(amount: amount * (1.0 - FusdUsdtSwapPair.getFeePercentage()))
  	let quote = FlowSwapPair.quoteSwapExactToken2ForToken1(amount: quote0 * (1.0 - FlowSwapPair.getFeePercentage()))
  	let poolAmounts0 = FlowSwapPair.getPoolAmounts()
	let currentPrice = (poolAmounts0.token1Amount / poolAmounts0.token2Amount) * (1.0 - FlowSwapPair.getFeePercentage())

	return currentPrice
}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
	let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}
    let listing: &SprtNFTStorefront.Listing{SprtNFTStorefront.ListingPublic}

	prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
                SprtNFTStorefront.StorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")

        self.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Not found SprtNFTStorefront.Storefront PATH: ".concat(SprtNFTStorefront.StorefrontStoragePath.toString()))
		
        let listingDetails = self.listing.getDetails();
		assert(listingDetails.salePaymentVaultType == Type<@Elvn.Vault>(), message: "Invalid salePaymentVaultType, only supported for elvn vault")
		let elvnPrice = listingDetails.salePrice;

		let threshold = 1.01;
		let flowAmount = getFUSDToFlowPrice(amount: elvnPrice) * threshold

		let flowTokenVault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) 
        	?? panic("Could not borrow reference to the owner's Vault!")

		let flowVault <- flowTokenVault.withdraw(amount: flowAmount) as! @FlowToken.Vault;
		let tUSDTVault <- FlowSwapPair.swapToken1ForToken2(from: <- flowVault);
		let fusdVault <- FusdUsdtSwapPair.swapToken2ForToken1(from: <- tUSDTVault);

		let elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault) as! @Elvn.Vault
		let paymentVault <- elvnVault.withdraw(amount: elvnPrice)

		let item <- self.listing.purchase(
            payment: <- paymentVault
        )

        self.momentsCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)

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
