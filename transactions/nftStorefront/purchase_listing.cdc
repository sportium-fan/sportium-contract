import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
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

pub fun setupAccount(account: AuthAccount) {
    // If the account doesn't already have a Storefront
    if account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {

        // Create a new empty .Storefront
        let storefront <- NFTStorefront.createStorefront()
        
        // save it to the account
        account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)

        // create a public capability for the .Storefront
        account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
    }

    if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
        // Create a new Elvn Vault and put it in storage
        account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)

        // Create a public capability to the stored Vault that only exposes
        // the `deposit` method through the `Receiver` interface
        //
        account.link<&Elvn.Vault{FungibleToken.Receiver}>(
            /public/elvnReceiver,
            target: /storage/elvnVault
        )

        // Create a public capability to the stored Vault that only exposes
        // the `balance` field through the `Balance` interface
        //
        account.link<&Elvn.Vault{FungibleToken.Balance}>(
            /public/elvnBalance,
            target: /storage/elvnVault
        )
    }
}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {
        setupAccount(account: account)

        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")
        
        let price = self.listing.getDetails().salePrice

        let mainElvnVault = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)
            ?? panic("Cannot borrow Elvn vault from account storage")
        
        self.paymentVault <- mainElvnVault.withdraw(amount: price)

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
