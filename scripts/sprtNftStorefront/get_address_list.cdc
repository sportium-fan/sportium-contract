import SprtNFTStorefront from "../../contracts/SprtNFTStorefront.cdc"

pub fun main(): [Address] {
    return SprtNFTStorefront.getAddressList()
}
