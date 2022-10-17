export declare const getCollectionIds = "import NonFungibleToken from 0xNonFungibleToken\n\nimport Moments from 0xMoments\n\n// This script returns an array of all the NFT IDs in an account's collection.\n\npub fun main(address: Address): [UInt64] {\n    let account = getAccount(address)\n\n    let collectionRef = account.getCapability(Moments.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()\n        ?? panic(\"Could not borrow capability from public collection\")\n    \n    return collectionRef.getIDs()\n}\n ";
