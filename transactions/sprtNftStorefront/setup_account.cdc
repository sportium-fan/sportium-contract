import SprtNFTStorefront from "../../contracts/SprtNFTStorefront.cdc"

// This transaction installs the Storefront ressource in an account.

transaction {
    prepare(account: AuthAccount) {

        // If the account doesn't already have a Storefront
        if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {

            // Create a new empty .Storefront
            let storefront <- SprtNFTStorefront.createStorefront()
            
            // save it to the account
            account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)

            // create a public capability for the .Storefront
            account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)
        }

        let storefront = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) ?? panic("unreachable")
        storefront.saveAddress()
    }
}
