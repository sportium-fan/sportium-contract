import Pack from "../../contracts/sprt/Pack.cdc"

pub fun main(target: Address): [UInt64] {
	let collectionRef = getAccount(target)
		.getCapability(Pack.CollectionPublicPath)
		.borrow<&Pack.Collection{Pack.PackCollectionPublic}>() 
		?? panic("Not found collection")

	return collectionRef.getIds()
}
