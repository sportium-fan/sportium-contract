import Elvn from "../../contracts/Elvn.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import FlowToken from "../../contracts/FlowToken.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

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

    return {
        "elvn": elvnRef.balance,
        "fusd": fusdRef.balance,
        "flow": flowRef.balance
    }
}
