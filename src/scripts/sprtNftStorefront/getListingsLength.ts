export const getListingsLengthScript = `import SprtNFTStorefront from 0xSprtNFTStorefront

// This script returns the number of NFTs for sale in a given account's storefront.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let storefrontRef = account
        .getCapability<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(
            SprtNFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")
  
    return storefrontRef.getListingIDs().length
}
`;
