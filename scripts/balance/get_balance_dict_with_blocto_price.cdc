import FungibleToken from "../../contracts/FungibleToken.cdc"
import FusdUsdtSwapPair from "../../contracts/FusdUsdtSwapPair.cdc"

import Elvn from "../../contracts/Elvn.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import FlowToken from "../../contracts/FlowToken.cdc"
import FlowSwapPair from "../../contracts/FlowSwapPair.cdc"
import TeleportedSportiumToken from "../../contracts/TeleportedSportiumToken.cdc"

pub fun main(address: Address): {String: UFix64} {
    let account = getAccount(address)
    
    let elvnRef = account.getCapability(/public/elvnBalance)
        .borrow<&Elvn.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Elvn Vault")

    let fusdRef = account.getCapability(/public/fusdBalance)
        .borrow<&FUSD.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the FUSD Vault")
    
    let flowRef = account.getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the FLOW Vault")

    let sportiumRef = account.getCapability(/public/TeleportedSportiumTokenBalance)
        .borrow<&TeleportedSportiumToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the TeleportedSportium Vault")

    let flowFUSDPairQuote = FlowSwapPair.quoteSwapExactToken1ForToken2(
        amount: 1.0 * (1.0 - FlowSwapPair.feePercentage)
    )

    return {
        "elvn": elvnRef.balance,
        "fusd": fusdRef.balance,
        "flow": flowRef.balance,
        "sportium": sportiumRef.balance,
        "bloctoSwapFlowFUSDPairPrice": flowFUSDPairQuote
    }
}
