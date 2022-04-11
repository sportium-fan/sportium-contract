"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = void 0;
exports.getAddress = `import SprtNFTStorefront from 0xSprtNFTStorefront

pub fun main(storefrontId: UInt64): Address {
	return SprtNFTStorefront.getAddress(storefrontId: storefrontId)
}
`;
