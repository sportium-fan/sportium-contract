export const getCollectionLength = `import NonFungibleToken from 0xNonFungibleToken

import Moments from 0xMoments

// This script returns the size of an account's Moments collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Moments.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
`;
