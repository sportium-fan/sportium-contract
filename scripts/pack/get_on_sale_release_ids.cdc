import Pack from "../../contracts/Pack.cdc"

pub fun main(): [UInt64] {
	return Pack.getOnSaleReleaseIds()
}
