import FungibleToken from "../../contracts/std/FungibleToken.cdc"
import FlowToken from "../../contracts/std/FlowToken.cdc"
import FUSD from "../../contracts/std/FUSD.cdc"

import Elvn from "../../contracts/sprt/Elvn.cdc"

import FusdUsdtSwapPair from "../../contracts/blocto/FusdUsdtSwapPair.cdc"
import FlowSwapPair from "../../contracts/blocto/FlowSwapPair.cdc"
import TeleportedSportiumToken from "../../contracts/blocto/TeleportedSportiumToken.cdc"
import SprtUsdtSwapPair from "../../contracts/blocto/SprtUsdtSwapPair.cdc"

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

    let sprtUsdtPairQuote = SprtUsdtSwapPair.quoteSwapExactToken1ForToken2(
        amount: 1.0 * (1.0 - SprtUsdtSwapPair.feePercentage)
    )

    return {
        "elvn": elvnRef.balance,
        "fusd": fusdRef.balance,
        "flow": flowRef.balance,
        "sportium": sportiumRef.balance,
        "bloctoSwapFlowFUSDPairPrice": flowFUSDPairQuote,
        "bloctoSwapSprtUsdtPairPrice": sprtUsdtPairQuote
    }
}
 