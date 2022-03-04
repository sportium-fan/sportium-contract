export const getBalanceDictWithBloctoPrice = `import Elvn from 0xElvn
import FUSD from 0xFUSD
import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken
import FlowSwapPair from 0xFlowSwapPair
import FusdUsdtSwapPair from 0xFusdUsdtSwapPair

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
`;
