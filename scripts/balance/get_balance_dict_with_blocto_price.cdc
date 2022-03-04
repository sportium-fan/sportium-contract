import Elvn from "../../contracts/Elvn.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import FlowToken from "../../contracts/FlowToken.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"
import FlowSwapPair from "../../contracts/FlowSwapPair.cdc"
import FusdUsdtSwapPair from "../../contracts/FusdUsdtSwapPair.cdc"

pub fun main(address: Address): {String: UFix64} {
    let account = getAccount(address)
    
    let elvnRef = account.getCapability(/public/elvnBalance)!.borrow<&Elvn.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    let fusdRef = account.getCapability(/public/fusdBalance)!
        .borrow<&FUSD.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")
    
    let flowRef = account.getCapability(/public/flowTokenBalance)!
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    let flowFUSDPairQuote = FlowSwapPair.quoteSwapExactToken1ForToken2(
        amount: 1.0 * (1.0 - FlowSwapPair.feePercentage)
    )

    return {
        "elvn": elvnRef.balance,
        "fusd": fusdRef.balance,
        "flow": flowRef.balance,
        "bloctoSwapFlowFUSDPairPrice": flowFUSDPairQuote
    }
}
