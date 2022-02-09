export const removeListingTransaction = `import SprtNFTStorefront from 0xSprtNFTStorefront

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

transaction(listingResourceID: UInt64) {
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontManager}

    prepare(account: AuthAccount) {
        setupAccount(account: account)

        self.storefront = account.borrow<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontManager}>(from: SprtNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed SprtNFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
`;
