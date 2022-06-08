export const allAmountWithdrawFusd = `import FungibleToken from 0xstd/FungibleToken

import ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury

transaction(recipient: Address) {
    let treasuryAdmin: &ElvnFUSDTreasury.FUSDAdministrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.treasuryAdmin = signer
            .borrow<&ElvnFUSDTreasury.FUSDAdministrator>(from: /storage/treasuryFUSDAdmin)
            ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/fusdReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        self.tokenReceiver.deposit(from: <- self.treasuryAdmin.withdrawAllAmount())
    }
}
`;
