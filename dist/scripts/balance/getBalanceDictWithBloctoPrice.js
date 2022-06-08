"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalanceDictWithBloctoPrice = void 0;
exports.getBalanceDictWithBloctoPrice = `import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD

import Elvn from 0xElvn

import FusdUsdtSwapPair from 0xFusdUsdtSwapPair
import FlowSwapPair from 0xFlowSwapPair
import TeleportedSportiumToken from 0xTeleportedSportiumToken
import SprtUsdtSwapPair from 0xSprtUsdtSwapPair

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
`;
