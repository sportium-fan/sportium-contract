export const transferMomentTransaction = `import NonFungibleToken from 0xNonFungibleToken
import Moments from 0xMoments

// This transaction transfers a Moment from one account to another.

pub fun setupAccount(account: AuthAccount) {
    // if the account doesn't already have a collection
    if account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {

        // create a new empty collection
        let collection <- Moments.createEmptyCollection()
        
        // save it to the account
        account.save(<-collection, to: Moments.CollectionStoragePath)

        // create a public capability for the collection
        account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)
    }
}

transaction(recipient: Address, withdrawID: UInt64) {
    prepare(account: AuthAccount) {
        setupAccount(account: account)
        
        // get the recipients public account object
        let recipient = getAccount(recipient)

        // borrow a reference to the signer's NFT collection
        let collectionRef = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        let depositRef = recipient.getCapability(Moments.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()!

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}
`;
