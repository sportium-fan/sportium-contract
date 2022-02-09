"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAmountWithdrawFusd = void 0;
exports.allAmountWithdrawFusd = `import FungibleToken from 0xFungibleToken
import ElvnFUSDTreasury from 0xElvnFUSDTreasury

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
