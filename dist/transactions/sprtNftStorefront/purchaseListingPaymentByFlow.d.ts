export declare const purchaseListingPaymentByFlow = "import FungibleToken from 0xFungibleToken\nimport NonFungibleToken from 0xNonFungibleToken\nimport FlowToken from 0xFlowToken\nimport FUSD from 0xFUSD\n\nimport FlowSwapPair from 0xFlowSwapPair\nimport FusdUsdtSwapPair from 0xFusdUsdtSwapPair\n\nimport Elvn from 0xElvn\nimport ElvnFUSDTreasury from 0xElvnFUSDTreasury\nimport Moments from 0xMoments\nimport SprtNFTStorefront from 0xSprtNFTStorefront\n\n// blocto swap route: fusd <-> tusdt <-> flow\npub fun getFUSDToFlowPrice(amount: UFix64): UFix64 {\n\tlet quote0 = FusdUsdtSwapPair.quoteSwapExactToken1ForToken2(amount: amount * (1.0 - FusdUsdtSwapPair.getFeePercentage()))\n  \tlet quote = FlowSwapPair.quoteSwapExactToken2ForToken1(amount: quote0 * (1.0 - FlowSwapPair.getFeePercentage()))\n  \tlet poolAmounts0 = FlowSwapPair.getPoolAmounts()\n\tlet currentPrice = (poolAmounts0.token1Amount / poolAmounts0.token2Amount) * (1.0 - FlowSwapPair.getFeePercentage())\n\n\treturn currentPrice\n}\n\ntransaction(listingResourceID: UInt64, storefrontAddress: Address) {\n\tlet momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}\n    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}\n    let listing: &SprtNFTStorefront.Listing{SprtNFTStorefront.ListingPublic}\n\n\tprepare(account: AuthAccount) {\n        self.storefront = getAccount(storefrontAddress)\n            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(\n                SprtNFTStorefront.StorefrontPublicPath\n            )\n            .borrow()\n            ?? panic(\"Could not borrow Storefront from provided address\")\n\n        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)\n            ?? panic(\"No Listing with that ID in Storefront\")\n\n        self.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)\n            ?? panic(\"Not found SprtNFTStorefront.Storefront PATH: \".concat(SprtNFTStorefront.StorefrontStoragePath.toString()))\n\t\t\n        let listingDetails = self.listing.getDetails();\n\t\tassert(listingDetails.salePaymentVaultType == Type<@Elvn.Vault>(), message: \"Invalid salePaymentVaultType, only supported for elvn vault\")\n\t\tlet elvnPrice = listingDetails.salePrice;\n\n\t\tlet threshold = 1.01;\n\t\tlet flowAmount = getFUSDToFlowPrice(amount: elvnPrice) * threshold\n\n\t\tlet flowTokenVault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) \n        \t?? panic(\"Could not borrow reference to the owner's Vault!\")\n\n\t\tlet flowVault <- flowTokenVault.withdraw(amount: flowAmount) as! @FlowToken.Vault;\n\t\tlet tUSDTVault <- FlowSwapPair.swapToken1ForToken2(from: <- flowVault);\n\t\tlet fusdVault <- FusdUsdtSwapPair.swapToken2ForToken1(from: <- tUSDTVault);\n\n\t\tlet elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault) as! @Elvn.Vault\n\t\tlet paymentVault <- elvnVault.withdraw(amount: elvnPrice)\n\n\t\tlet item <- self.listing.purchase(\n            payment: <- paymentVault\n        )\n\n        self.momentsCollection.deposit(token: <-item)\n\n        self.storefront.cleanup(listingResourceID: listingResourceID)\n\n\t\tif elvnVault.balance > 0.0 {\n\t\t\tlet fusdVault <- ElvnFUSDTreasury.swapElvnToFUSD(vault: <- elvnVault) as! @FUSD.Vault\n\t\t\tlet tUSDTVault <- FusdUsdtSwapPair.swapToken1ForToken2(from: <-fusdVault)\n\t\t\tlet flowVault <- FlowSwapPair.swapToken2ForToken1(from: <- tUSDTVault)\n\t\t\t\n\t\t\tflowTokenVault.deposit(from: <- flowVault)\n\t\t} else {\n\t\t\tdestroy elvnVault\n\t\t}\n\t}\n\n\texecute {\n\t}\n}\n";
