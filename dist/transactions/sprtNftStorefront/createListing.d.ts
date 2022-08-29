export declare const createListing = "import FungibleToken from 0xFungibleToken\nimport NonFungibleToken from 0xNonFungibleToken\n\nimport Elvn from 0xElvn\nimport Moments from 0xMoments\nimport SprtNFTStorefront from 0xSprtNFTStorefront\n\ntransaction(saleItemID: UInt64, saleItemPrice: UFix64) {\n\n    let elvnReceiver: Capability<&Elvn.Vault{FungibleToken.Receiver}>\n    let momentsProvider: Capability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>\n    let storefront: &SprtNFTStorefront.Storefront\n\n    prepare(account: AuthAccount) {\n        // We need a provider capability, but one is not provided by default so we create one if needed.\n        let momentsCollectionProviderPrivatePath = /private/sprtMomentsCollectionProviderDev0270\n\n        self.elvnReceiver = account.getCapability<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver)!\n\n        assert(self.elvnReceiver.borrow() != nil, message: \"Missing or mis-typed Elvn receiver\")\n\n        if !account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath).check() {\n            account.link<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath, target: Moments.CollectionStoragePath)\n        }\n\n        self.momentsProvider = account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)\n\n        assert(self.momentsProvider.borrow() != nil, message: \"Missing or mis-typed Moments.Collection provider\")\n\n        self.storefront = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)\n            ?? panic(\"Not found SprtNFTStorefront.Storefront PATH: \".concat(SprtNFTStorefront.StorefrontStoragePath.toString()))\n    }\n\n    execute {\n        let saleCut = SprtNFTStorefront.SaleCut(\n            receiver: self.elvnReceiver,\n            amount: saleItemPrice\n        )\n        self.storefront.createListing(\n            nftProviderCapability: self.momentsProvider,\n            nftType: Type<@Moments.NFT>(),\n            nftID: saleItemID,\n            salePaymentVaultType: Type<@Elvn.Vault>(),\n            saleCuts: [saleCut]\n        )\n    }\n}\n ";
