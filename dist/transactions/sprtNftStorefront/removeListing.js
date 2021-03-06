"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeListing = void 0;
exports.removeListing = `import SprtNFTStorefront from 0xSprtNFTStorefront

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
