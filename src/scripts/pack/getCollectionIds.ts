export const getCollectionIds = `import Pack from 0xPack

pub fun main(target: Address): [UInt64] {
	let collectionRef = getAccount(target)
		.getCapability(Pack.CollectionPublicPath)
		.borrow<&Pack.Collection{Pack.PackCollectionPublic}>() 
		?? panic("Not found collection")

	return collectionRef.getIds()
}
`;
