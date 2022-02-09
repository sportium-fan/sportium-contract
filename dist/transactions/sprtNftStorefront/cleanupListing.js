"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupListing = void 0;
exports.cleanupListing = `import SprtNFTStorefront from 0xSprtNFTStorefront

pub fun setupAccount(account: AuthAccount) {
    // If the account doesn't already have a Storefront
    if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {

        // Create a new empty .Storefront
        let storefront <- SprtNFTStorefront.createStorefront()
        
        // save it to the account
        account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)

        // create a public capability for the .Storefront
        account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)
    }
}


transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}

    prepare(account: AuthAccount) {
        setupAccount(account: account)

        self.storefront = getAccount(storefrontAddress)
            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
                SprtNFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")
    }

    execute {
        // Be kind and recycle
        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
`;
