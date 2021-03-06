"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAmountWithdrawElvn = void 0;
exports.allAmountWithdrawElvn = `import FungibleToken from 0xFungibleToken

import ElvnFUSDTreasury from 0xElvnFUSDTreasury

transaction(recipient: Address) {
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
        self.tokenReceiver.deposit(from: <- self.treasuryAdmin.withdrawAllAmount())
    }
}
`;
