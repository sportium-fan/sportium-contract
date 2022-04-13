import Pack from "../../contracts/Pack.cdc"

pub fun main(releaseId: UInt64): Int {
	return Pack.getMomentsListRemainingCount(releaseId: releaseId)
}
