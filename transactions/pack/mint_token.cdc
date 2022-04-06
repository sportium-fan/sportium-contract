import Pack from "../../contracts/Pack.cdc"
import Moments from "../../contracts/Moments.cdc"

transaction(recipient: Address, releaseId: UInt64, packPrice: UFix64, momentTokenIds: [UInt64]) {
    let admin: &Pack.Administrator
    let adminMomentsCollectionRef: &Moments.Collection

    let recipientCollectionRef: &Pack.Collection{Pack.PackCollectionPublic}

    prepare(account: AuthAccount) {
        self.admin = account
            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)
            ?? panic("Signer is not the pack admin")
        
        self.adminMomentsCollectionRef = account
            .borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(Pack.CollectionPublicPath)
            .borrow<&Pack.Collection{Pack.PackCollectionPublic}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        for id in momentTokenIds {
            self.adminMomentsCollectionRef.borrowMoment(id: id) 
                ?? panic("Not found tokenId: ".concat(id.toString()))
        }

        let momentsList: @[Moments.NFT] <- []
        for id in momentTokenIds {
            let moments <- self.adminMomentsCollectionRef.withdraw(withdrawID: id) as! @Moments.NFT
            momentsList.append(<- moments)
        }

        let packToken <- self.admin
            .createPackToken(
                releaseId: releaseId, 
                price: packPrice, 
                momentsMap: <- momentsList
            )

        self.recipientCollectionRef.deposit(token: <- packToken)
    }
}
