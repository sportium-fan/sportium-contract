import Pack from "../../contracts/sprt/Pack.cdc"

pub fun main(releaseId: UInt64): Int {
	return Pack.getMomentsListRemainingCount(releaseId: releaseId)
}
