import ElvnFeeTreasury from "../../contracts/ElvnFeeTreasury.cdc"

pub fun main(): UFix64 {
    return ElvnFeeTreasury.getBalance()
}
