import SprtNFTStorefront from "../../contracts/sprt/SprtNFTStorefront.cdc"

pub fun main(storefrontId: UInt64): Address {
	return SprtNFTStorefront.getAddress(storefrontId: storefrontId)
}
