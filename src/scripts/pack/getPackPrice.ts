export const getPackPrice = `import Pack from 0xPack

pub fun main(releaseId: UInt64): UFix64 {
	return Pack.getPackPrice(releaseId: releaseId)
}
`;
