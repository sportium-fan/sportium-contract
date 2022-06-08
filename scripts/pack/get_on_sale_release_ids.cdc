import Pack from "../../contracts/sprt/Pack.cdc"

pub fun main(): [UInt64] {
	return Pack.getOnSaleReleaseIds()
}
