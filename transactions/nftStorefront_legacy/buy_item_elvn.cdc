import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import Moments from "../../contracts/Moments.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let saleOffer: &NFTStorefront.SaleOffer{NFTStorefront.SaleOfferPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")

        self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
            ?? panic("No offer with that ID in Storefront")
        
        let price = self.saleOffer.getDetails().salePrice

        let mainElvnVault = account.borrow<&Elvn.Vault>(from: Elvn.VaultStoragePath)
            ?? panic("Cannot borrow Elvn vault from account storage")
        
        self.paymentVault <- mainElvnVault.withdraw(amount: price)

        self.momentsCollection = account.borrow<&Moments.Collection{NonFungibleToken.Receiver}>(
            from: Moments.CollectionStoragePath
        ) ?? panic("Cannot borrow Moments collection receiver from account")
    }

    execute {
        let item <- self.saleOffer.accept(
            payment: <-self.paymentVault
        )

        self.momentsCollection.deposit(token: <-item)

        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
}
