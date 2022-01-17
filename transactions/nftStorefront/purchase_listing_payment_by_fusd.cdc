import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"
import Moments from "../../contracts/Moments.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

pub fun getOrCreateCollection(account: AuthAccount): &Moments.Collection{NonFungibleToken.Receiver} {
    if let collectionRef = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) {
        return collectionRef
    }

    // create a new empty collection
    let collection <- Moments.createEmptyCollection() as! @Moments.Collection

    let collectionRef = &collection as &Moments.Collection
    
    // save it to the account
    account.save(<-collection, to: Moments.CollectionStoragePath)

    // create a public capability for the collection
    account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)

    return collectionRef
}

pub fun swapFUSDToElvn(account: AuthAccount, amount: UFix64): @FungibleToken.Vault {
    let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) 
        ?? panic("Could not borrow reference to the owner's Vault!")
    let fusdVault <- vaultRef.withdraw(amount: amount) as! @FUSD.Vault

    return <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)
}


transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")
        
        let price = self.listing.getDetails().salePrice

        self.paymentVault <- swapFUSDToElvn(account: account, amount: price)
        self.momentsCollection = getOrCreateCollection(account: account)
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault
        )

        self.momentsCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
