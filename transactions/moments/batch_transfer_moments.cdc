import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Moments from "../../contracts/Moments.cdc"

transaction(recipient: Address, withdrawIds: [UInt64]) {
    prepare(account: AuthAccount) {
	let recipient = getAccount(recipient)

	let collectionRef = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
		?? panic("Colud not borrow a reference to the owner's collection")

        let depositRef = recipient.getCapability(Moments.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()!

	for withdrawId in withdrawIds {
		let nft <- collectionRef.withdraw(withdrawID: withdrawId)
		depositRef.deposit(token: <-nft)
	}
    }
}
