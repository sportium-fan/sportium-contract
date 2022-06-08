"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListing = void 0;
exports.createListing = `import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import Elvn from 0xElvn
import Moments from 0xMoments
import SprtNFTStorefront from 0xSprtNFTStorefront

pub fun getOrCreateStorefront(account: AuthAccount): &SprtNFTStorefront.Storefront {
    if let storefrontRef = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) {
        return storefrontRef
    }

    let storefront <- SprtNFTStorefront.createStorefront()

    let storefrontRef = &storefront as &SprtNFTStorefront.Storefront

    account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)

    account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)

    return storefrontRef
}

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

    if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
        // Create a new Elvn Vault and put it in storage
        account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)

        // Create a public capability to the stored Vault that only exposes
        // the deposit method through the Receiver interface
        //
        account.link<&Elvn.Vault{FungibleToken.Receiver}>(
            /public/elvnReceiver,
            target: /storage/elvnVault
        )

        // Create a public capability to the stored Vault that only exposes
        // the balance field through the Balance interface
        //
        account.link<&Elvn.Vault{FungibleToken.Balance}>(
            /public/elvnBalance,
            target: /storage/elvnVault
        )
    }

    if account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {
        // create a new empty collection
        let collection <- Moments.createEmptyCollection()
        
        // save it to the account
        account.save(<-collection, to: Moments.CollectionStoragePath)

        // create a public capability for the collection
        account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)
    }
}

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let elvnReceiver: Capability<&Elvn.Vault{FungibleToken.Receiver}>
    let momentsProvider: Capability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &SprtNFTStorefront.Storefront

    prepare(account: AuthAccount) {
        setupAccount(account: account)

        // We need a provider capability, but one is not provided by default so we create one if needed.
        let momentsCollectionProviderPrivatePath = /private/momentsCollectionProviderForCBTV1

        self.elvnReceiver = account.getCapability<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver)!

        assert(self.elvnReceiver.borrow() != nil, message: "Missing or mis-typed Elvn receiver")

        if !account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath).check() {
            account.link<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath, target: Moments.CollectionStoragePath)
        }

        self.momentsProvider = account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)

        assert(self.momentsProvider.borrow() != nil, message: "Missing or mis-typed Moments.Collection provider")

        self.storefront = getOrCreateStorefront(account: account)
    }

    execute {
        let saleCut = SprtNFTStorefront.SaleCut(
            receiver: self.elvnReceiver,
            amount: saleItemPrice
        )
        self.storefront.createListing(
            nftProviderCapability: self.momentsProvider,
            nftType: Type<@Moments.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@Elvn.Vault>(),
            saleCuts: [saleCut]
        )
    }
}
 `;
