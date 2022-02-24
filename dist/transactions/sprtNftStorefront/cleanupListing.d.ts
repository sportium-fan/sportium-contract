export declare const cleanupListing = "import SprtNFTStorefront from 0xSprtNFTStorefront\n\npub fun setupAccount(account: AuthAccount) {\n    // If the account doesn't already have a Storefront\n    if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {\n\n        // Create a new empty .Storefront\n        let storefront <- SprtNFTStorefront.createStorefront()\n        \n        // save it to the account\n        account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)\n\n        // create a public capability for the .Storefront\n        account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)\n    }\n}\n\n\ntransaction(listingResourceID: UInt64, storefrontAddress: Address) {\n    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}\n\n    prepare(account: AuthAccount) {\n        setupAccount(account: account)\n\n        self.storefront = getAccount(storefrontAddress)\n            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(\n                SprtNFTStorefront.StorefrontPublicPath\n            )!\n            .borrow()\n            ?? panic(\"Cannot borrow Storefront from provided address\")\n    }\n\n    execute {\n        // Be kind and recycle\n        self.storefront.cleanup(listingResourceID: listingResourceID)\n    }\n}\n";