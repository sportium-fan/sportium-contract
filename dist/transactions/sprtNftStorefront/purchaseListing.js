"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseListing = void 0;
exports.purchaseListing = `import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

import Elvn from 0xElvn
import Moments from 0xMoments
import SprtNFTStorefront from 0xSprtNFTStorefront

transaction(listingResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}
    let listing: &SprtNFTStorefront.Listing{SprtNFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
                SprtNFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")
        
        let price = self.listing.getDetails().salePrice

        let mainElvnVault = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)
            ?? panic("Cannot borrow Elvn vault from account storage")
        
        self.paymentVault <- mainElvnVault.withdraw(amount: price)

        self.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Not found SprtNFTStorefront.Storefront PATH: ".concat(SprtNFTStorefront.StorefrontStoragePath.toString()))
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault
        )

        self.momentsCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
`;
