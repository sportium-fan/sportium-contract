import FungibleToken from "../../contracts/std/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/std/NonFungibleToken.cdc"

import Elvn from "../../contracts/sprt/Elvn.cdc"
import Moments from "../../contracts/sprt/Moments.cdc"
import SprtNFTStorefront from "../../contracts/sprt/SprtNFTStorefront.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let elvnReceiver: Capability<&Elvn.Vault{FungibleToken.Receiver}>
    let momentsProvider: Capability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &SprtNFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let momentsCollectionProviderPrivatePath = /private/sprtMomentsCollectionProvider

        self.elvnReceiver = account.getCapability<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver)!

        assert(self.elvnReceiver.borrow() != nil, message: "Missing or mis-typed Elvn receiver")

        if !account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath).check() {
            account.link<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath, target: Moments.CollectionStoragePath)
        }

        self.momentsProvider = account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)

        assert(self.momentsProvider.borrow() != nil, message: "Missing or mis-typed Moments.Collection provider")

        self.storefront = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)
            ?? panic("Not found SprtNFTStorefront.Storefront PATH: ".concat(SprtNFTStorefront.StorefrontStoragePath.toString()))
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
 