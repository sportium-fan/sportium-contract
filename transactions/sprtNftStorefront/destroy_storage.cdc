
import SprtNFTStorefront from "../../contracts/sprt/SprtNFTStorefront.cdc"

transaction {
    prepare(account: AuthAccount) {
		  let storefront <- account
        .load<@SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)
        ?? panic("Not Found SprtNFTStorefront.Storefront Resource")

      destroy storefront
    }
}
