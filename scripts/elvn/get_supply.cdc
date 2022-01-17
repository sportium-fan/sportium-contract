import Elvn from "../../contracts/Elvn.cdc"

// This script returns the total amount of Elvn currently in existence.

pub fun main(): UFix64 {

    let supply = Elvn.totalSupply

    log(supply)

    return supply
}
