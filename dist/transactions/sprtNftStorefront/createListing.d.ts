export declare const createListing = "import FungibleToken from 0xFungibleToken\nimport NonFungibleToken from 0xNonFungibleToken\nimport Elvn from 0xElvn\nimport Moments from 0xMoments\nimport SprtNFTStorefront from 0xSprtNFTStorefront\n\npub fun getOrCreateStorefront(account: AuthAccount): &SprtNFTStorefront.Storefront {\n    if let storefrontRef = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) {\n        return storefrontRef\n    }\n\n    let storefront <- SprtNFTStorefront.createStorefront()\n\n    let storefrontRef = &storefront as &SprtNFTStorefront.Storefront\n\n    account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)\n\n    account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)\n\n    return storefrontRef\n}\n\npub fun setupAccount(account: AuthAccount) {\n    // If the account doesn't already have a Storefront\n    if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {\n\n        // Create a new empty .Storefront\n        let storefront <- SprtNFTStorefront.createStorefront()\n        \n        // save it to the account\n        account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)\n\n        // create a public capability for the .Storefront\n        account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)\n    }\n\n    if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {\n        // Create a new Elvn Vault and put it in storage\n        account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)\n\n        // Create a public capability to the stored Vault that only exposes\n        // the deposit method through the Receiver interface\n        //\n        account.link<&Elvn.Vault{FungibleToken.Receiver}>(\n            /public/elvnReceiver,\n            target: /storage/elvnVault\n        )\n\n        // Create a public capability to the stored Vault that only exposes\n        // the balance field through the Balance interface\n        //\n        account.link<&Elvn.Vault{FungibleToken.Balance}>(\n            /public/elvnBalance,\n            target: /storage/elvnVault\n        )\n    }\n\n    if account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {\n        // create a new empty collection\n        let collection <- Moments.createEmptyCollection()\n        \n        // save it to the account\n        account.save(<-collection, to: Moments.CollectionStoragePath)\n\n        // create a public capability for the collection\n        account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)\n    }\n}\n\ntransaction(saleItemID: UInt64, saleItemPrice: UFix64) {\n\n    let elvnReceiver: Capability<&Elvn.Vault{FungibleToken.Receiver}>\n    let momentsProvider: Capability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>\n    let storefront: &SprtNFTStorefront.Storefront\n\n    prepare(account: AuthAccount) {\n        setupAccount(account: account)\n\n        // We need a provider capability, but one is not provided by default so we create one if needed.\n        let momentsCollectionProviderPrivatePath = /private/momentsCollectionProvider\n\n        self.elvnReceiver = account.getCapability<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver)!\n\n        assert(self.elvnReceiver.borrow() != nil, message: \"Missing or mis-typed Elvn receiver\")\n\n        if !account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath).check() {\n            account.link<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath, target: Moments.CollectionStoragePath)\n        }\n\n        self.momentsProvider = account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)\n\n        assert(self.momentsProvider.borrow() != nil, message: \"Missing or mis-typed Moments.Collection provider\")\n\n        self.storefront = getOrCreateStorefront(account: account)\n    }\n\n    execute {\n        let saleCut = SprtNFTStorefront.SaleCut(\n            receiver: self.elvnReceiver,\n            amount: saleItemPrice\n        )\n        self.storefront.createListing(\n            nftProviderCapability: self.momentsProvider,\n            nftType: Type<@Moments.NFT>(),\n            nftID: saleItemID,\n            salePaymentVaultType: Type<@Elvn.Vault>(),\n            saleCuts: [saleCut]\n        )\n    }\n}\n ";
