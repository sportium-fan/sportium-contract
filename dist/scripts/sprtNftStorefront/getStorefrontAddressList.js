"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorefrontAddressList = void 0;
exports.getStorefrontAddressList = `import SprtNFTStorefront from 0xSprtNFTStorefront

pub fun main(): [Address] {
	return SprtNFTStorefront.getAddressList()
}
`;
