import NonFungibleToken from "../../contracts/std/NonFungibleToken.cdc"

import Moments from "../../contracts/sprt/Moments.cdc"

// This script returns the size of an account's Moments collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Moments.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
