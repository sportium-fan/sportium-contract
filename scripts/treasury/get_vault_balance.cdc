import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

pub fun main(): [UFix64] {
    return ElvnFUSDTreasury.getBalance()
}
