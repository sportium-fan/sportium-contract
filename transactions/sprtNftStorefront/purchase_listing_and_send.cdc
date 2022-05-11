import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"

import Elvn from "../../contracts/Elvn.cdc"
import Moments from "../../contracts/Moments.cdc"
import SprtNFTStorefront from "../../contracts/SprtNFTStorefront.cdc"

transaction(listingResourceID: UInt64, storefrontAddress: Address, target: Address) {
    let paymentVault: @FungibleToken.Vault
    let momentsCollection: &Moments.Collection{Moments.MomentsCollectionPublic}
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}
    let listing: &SprtNFTStorefront.Listing{SprtNFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
                SprtNFTStorefront.StorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")
        
        let price = self.listing.getDetails().salePrice

        let mainElvnVault = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)
            ?? panic("Cannot borrow Elvn vault from account storage")
        
        self.paymentVault <- mainElvnVault.withdraw(amount: price)

        let account = getAccount(target)
        self.momentsCollection = account.getCapability(Moments.CollectionPublicPath)
            .borrow<&Moments.Collection{Moments.MomentsCollectionPublic}>()
            ?? panic("Cannot borrow Moments collection from target account storage")
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault
        )

        self.momentsCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
