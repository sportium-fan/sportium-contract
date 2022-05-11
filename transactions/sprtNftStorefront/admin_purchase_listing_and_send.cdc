import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"

import Elvn from "../../contracts/Elvn.cdc"
import Moments from "../../contracts/Moments.cdc"
import SprtNFTStorefront from "../../contracts/SprtNFTStorefront.cdc"

transaction(listingResourceID: UInt64, storefrontAddress: Address, target: Address) {
    let tokenAdmin: &Elvn.Administrator

    let momentsCollection: &Moments.Collection{Moments.MomentsCollectionPublic}
    let storefront: &SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}
    let listing: &SprtNFTStorefront.Listing{SprtNFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {
		self.tokenAdmin = account
 	       .borrow<&Elvn.Administrator>(from: /storage/elvnAdmin)
 	       ?? panic("Signer is not the token admin")

        self.storefront = getAccount(storefrontAddress)
            .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
                SprtNFTStorefront.StorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")
        
        let target = getAccount(target)
        self.momentsCollection = target.getCapability(Moments.CollectionPublicPath)
            .borrow<&Moments.Collection{Moments.MomentsCollectionPublic}>()
            ?? panic("Cannot borrow Moments collection from target account storage")
    }

    execute {
        let price = self.listing.getDetails().salePrice
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: price)
		let vault <- minter.mintTokens(amount: price)

        let item <- self.listing.purchase(
            payment: <-vault
        )

        self.momentsCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)

        destroy minter
    }
}
