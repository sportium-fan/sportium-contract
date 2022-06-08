export const removeListing = `import SprtNFTStorefront from 0xsprt/SprtNFTStorefront

transaction(listingResourceID: UInt64) {
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontManager}

    prepare(account: AuthAccount) {
        self.storefront = account.borrow<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontManager}>(from: SprtNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed SprtNFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
`;
