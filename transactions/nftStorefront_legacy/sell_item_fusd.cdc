import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import Moments from "../../contracts/Moments.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let fusdReceiver: Capability<&FUSD.Vault{FungibleToken.Receiver}>
    let momentsProvider: Capability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let momentsCollectionProviderPrivatePath = /private/momentsCollectionProvider

        self.fusdReceiver = account.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!
        
        assert(self.fusdReceiver.borrow() != nil, message: "Missing or mis-typed Elvn receiver")

        if !account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)!.check() {
            account.link<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath, target: Moments.CollectionStoragePath)
        }

        self.momentsProvider = account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)!
        
        assert(self.momentsProvider.borrow() != nil, message: "Missing or mis-typed Moments.Collection provider")

        self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.fusdReceiver,
            amount: saleItemPrice
        )
        self.storefront.createSaleOffer(
            nftProviderCapability: self.momentsProvider,
            nftType: Type<@Moments.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@FUSD.Vault>(),
            saleCuts: [saleCut]
        )
    }
}
