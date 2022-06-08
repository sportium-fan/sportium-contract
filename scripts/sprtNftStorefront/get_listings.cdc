import SprtNFTStorefront from "../../contracts/sprt/SprtNFTStorefront.cdc"

// This script returns an array of all the NFTs uuids for sale through a Storefront

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let storefrontRef = account
        .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
            SprtNFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")
    
  	return storefrontRef.getListingIDs()
}
