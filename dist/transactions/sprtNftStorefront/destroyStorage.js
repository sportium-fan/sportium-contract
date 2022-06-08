"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyStorage = void 0;
exports.destroyStorage = `
import SprtNFTStorefront from 0xsprt/SprtNFTStorefront

transaction {
    prepare(account: AuthAccount) {
		  let storefront <- account
        .load<@SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)
        ?? panic("Not Found SprtNFTStorefront.Storefront Resource")

      destroy storefront
    }
}
`;
