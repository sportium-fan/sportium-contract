export const cleanupListing = `import SprtNFTStorefront from 0xsprt/SprtNFTStorefront

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}

    prepare(account: AuthAccount) {
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
