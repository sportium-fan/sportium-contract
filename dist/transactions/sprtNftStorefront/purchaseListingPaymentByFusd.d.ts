export declare const purchaseListingPaymentByFusd = "import FungibleToken from 0xFungibleToken\nimport NonFungibleToken from 0xNonFungibleToken\nimport FUSD from 0xFUSD\nimport Elvn from 0xElvn\nimport ElvnFUSDTreasury from 0xElvnFUSDTreasury\nimport Moments from 0xMoments\nimport SprtNFTStorefront from 0xSprtNFTStorefront\n\npub fun getOrCreateCollection(account: AuthAccount): &Moments.Collection{NonFungibleToken.Receiver} {\n    if let collectionRef = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) {\n        return collectionRef\n    }\n\n    // create a new empty collection\n    let collection <- Moments.createEmptyCollection() as! @Moments.Collection\n\n    let collectionRef = &collection as &Moments.Collection\n    \n    // save it to the account\n    account.save(<-collection, to: Moments.CollectionStoragePath)\n\n    // create a public capability for the collection\n    account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)\n\n    return collectionRef\n}\n\npub fun swapFUSDToElvn(account: AuthAccount, amount: UFix64): @FungibleToken.Vault {\n    let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) \n        ?? panic(\"Could not borrow reference to the owner's Vault!\")\n    let fusdVault <- vaultRef.withdraw(amount: amount) as! @FUSD.Vault\n\n    return <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)\n}\n\npub fun setupAccount(account: AuthAccount) {\n    // If the account doesn't already have a Storefront\n    if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {\n\n        // Create a new empty .Storefront\n        let storefront <- SprtNFTStorefront.createStorefront()\n        \n        // save it to the account\n        account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)\n\n        // create a public capability for the .Storefront\n        account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)\n    }\n\n    if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {\n        // Create a new Elvn Vault and put it in storage\n        account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)\n\n        // Create a public capability to the stored Vault that only exposes\n        // the deposit method through the Receiver interface\n        //\n        account.link<&Elvn.Vault{FungibleToken.Receiver}>(\n            /public/elvnReceiver,\n            target: /storage/elvnVault\n        )\n\n        // Create a public capability to the stored Vault that only exposes\n        // the balance field through the Balance interface\n        //\n        account.link<&Elvn.Vault{FungibleToken.Balance}>(\n            /public/elvnBalance,\n            target: /storage/elvnVault\n        )\n    }\n\n    if account.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {\n        account.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)\n\n        account.link<&FUSD.Vault{FungibleToken.Receiver}>(\n            /public/fusdReceiver,\n            target: /storage/fusdVault\n        )\n\n        account.link<&FUSD.Vault{FungibleToken.Balance}>(\n            /public/fusdBalance,\n            target: /storage/fusdVault\n        )\n    }\n}\n\ntransaction(listingResourceID: UInt64, storefrontAddress: Address) {\n    let paymentVault: @FungibleToken.Vault\n    let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}\n    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}\n    let listing: &SprtNFTStorefront.Listing{SprtNFTStorefront.ListingPublic}\n\n    prepare(account: AuthAccount) {\n        setupAccount(account: account)\n\n        self.storefront = getAccount(storefrontAddress)\n            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(\n                SprtNFTStorefront.StorefrontPublicPath\n            )\n            .borrow()\n            ?? panic(\"Could not borrow Storefront from provided address\")\n\n        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)\n            ?? panic(\"No Listing with that ID in Storefront\")\n        \n        let price = self.listing.getDetails().salePrice\n\n        self.paymentVault <- swapFUSDToElvn(account: account, amount: price)\n        self.momentsCollection = getOrCreateCollection(account: account)\n    }\n\n    execute {\n        let item <- self.listing.purchase(\n            payment: <-self.paymentVault\n        )\n\n        self.momentsCollection.deposit(token: <-item)\n\n        self.storefront.cleanup(listingResourceID: listingResourceID)\n    }\n}\n";