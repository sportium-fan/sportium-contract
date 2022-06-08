import Moments from "../../contracts/sprt/Moments.cdc"

// This scripts returns the number of Moments currently in existence.

pub fun main(): UInt64 {    
    return Moments.totalSupply
}
