import FungibleToken from "../../contracts/FungibleToken.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

transaction(recipient: Address, amount: UFix64) {
    let treasuryAdmin: &ElvnFUSDTreasury.ElvnAdministrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.treasuryAdmin = signer
            .borrow<&ElvnFUSDTreasury.ElvnAdministrator>(from: /storage/treasuryElvnAdmin)
            ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/elvnReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        self.tokenReceiver.deposit(from: <- self.treasuryAdmin.withdraw(amount: amount))
    }
}
