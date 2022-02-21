export const getListingItem = `import NonFungibleToken from 0xNonFungibleToken
import SprtNFTStorefront from 0xSprtNFTStorefront
import Moments from 0xMoments

pub struct SaleItem {
    pub let itemID: UInt64
    pub let metadata: {String: String}
    pub let owner: Address
    pub let price: UFix64

    init(itemID: UInt64, metadata: {String: String}, owner: Address, price: UFix64) {
        self.itemID = itemID
        self.metadata = metadata
        self.owner = owner
        self.price = price
    }
}

pub fun main(address: Address, listingResourceID: UInt64): SaleItem? {
    let account = getAccount(address)

    if let storefrontRef = account.getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath).borrow() {
        if let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID) {
            let details = listing.getDetails()

            let itemID = details.nftID
            let itemPrice = details.salePrice

            if let collection = account.getCapability<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath).borrow() {
                if let item = collection.borrowMoment(id: itemID) {
                    return SaleItem(itemID: itemID, metadata: item.getMetadata(), owner: address, price: itemPrice)
                }
            }
        }
    }

    return nil
}
`;
