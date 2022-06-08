import SprtNFTStorefront from "../../contracts/sprt/SprtNFTStorefront.cdc"

pub fun main(): [Address] {
    return SprtNFTStorefront.getAddressList()
}
