import SprtNFTStorefront from "../../contracts/sprt/SprtNFTStorefront.cdc"

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
