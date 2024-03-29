export const purchaseListingPaymentByFusd = `import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FUSD from 0xFUSD

import Elvn from 0xElvn
import ElvnFUSDTreasury from 0xElvnFUSDTreasury
import Moments from 0xMoments
import SprtNFTStorefront from 0xSprtNFTStorefront

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
        
        let listingDetails = self.listing.getDetails();
		assert(listingDetails.salePaymentVaultType == Type<@Elvn.Vault>(), message: "Invalid salePaymentVaultType, only supported for elvn vault")
        let price = listingDetails.salePrice

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
