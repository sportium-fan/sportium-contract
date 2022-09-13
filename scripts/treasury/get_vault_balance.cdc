import ElvnFUSDTreasury from "../../contracts/sprt/ElvnFUSDTreasury.cdc"

pub fun main(): [UFix64] {
    return ElvnFUSDTreasury.getBalance()
}
 