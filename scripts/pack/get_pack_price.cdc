import Pack from "../../contracts/Pack.cdc"

pub fun main(releaseId: UInt64): UFix64 {
	return Pack.getPackPrice(releaseId: releaseId)
}
