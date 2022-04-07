export const getStorefrontAddressList = `import SprtNFTStorefront from 0xSprtNFTStorefront

pub fun main(): [Address] {
	return SprtNFTStorefront.getAddressList()
}
`;
