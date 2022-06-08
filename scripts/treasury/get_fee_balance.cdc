import ElvnFeeTreasury from "../../contracts/sprt/ElvnFeeTreasury.cdc"

pub fun main(): UFix64 {
    return ElvnFeeTreasury.getBalance()
}
