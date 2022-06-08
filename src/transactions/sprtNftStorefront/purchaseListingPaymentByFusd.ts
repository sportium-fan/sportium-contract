export const purchaseListingPaymentByFusd = `import FungibleToken from 0xstd/FungibleToken
import NonFungibleToken from 0xstd/NonFungibleToken
import FUSD from 0xstd/FUSD

import Elvn from 0xsprt/Elvn
import ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury
import Moments from 0xsprt/Moments
import SprtNFTStorefront from 0xsprt/SprtNFTStorefront

pub fun swapFUSDToElvn(account: AuthAccount, amount: UFix64): @FungibleToken.Vault {
    let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) 
        ?? panic("Could not borrow reference to the owner's Vault!")
    let fusdVault <- vaultRef.withdraw(amount: amount) as! @FUSD.Vault

    return <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)
}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let momentsCollection: &Moments.Collection{NonFungibleToken.Receiver}
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

        self.paymentVault <- swapFUSDToElvn(account: account, amount: price)
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
