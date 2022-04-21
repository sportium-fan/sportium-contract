export const destroyStorage = `
import SprtNFTStorefront from 0xSprtNFTStorefront

transaction {
    prepare(account: AuthAccount) {
		  let storefront <- account
        .load<@SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)
        ?? panic("Not Found SprtNFTStorefront.Storefront Resource")

      destroy storefront
    }
}
`;
