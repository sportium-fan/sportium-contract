export const getAddress = `import SprtNFTStorefront from 0xSprtNFTStorefront

pub fun main(storefrontId: UInt64): Address {
	return SprtNFTStorefront.getAddress(storefrontId: storefrontId)
}
`;
