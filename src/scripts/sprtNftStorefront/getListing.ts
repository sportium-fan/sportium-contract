export const getListing = `import SprtNFTStorefront from 0xSprtNFTStorefront

// This script returns the details for a listing within a storefront

pub fun main(address: Address, listingResourceID: UInt64): SprtNFTStorefront.ListingDetails {
    let account = getAccount(address)

    let storefrontRef = account
        .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
            SprtNFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")

    let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic("No item with that ID")
    
    return listing.getDetails()
}
`;
