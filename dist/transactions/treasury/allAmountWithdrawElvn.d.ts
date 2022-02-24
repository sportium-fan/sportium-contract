export declare const allAmountWithdrawElvn = "import FungibleToken from 0xFungibleToken\nimport ElvnFUSDTreasury from 0xElvnFUSDTreasury\n\ntransaction(recipient: Address) {\n    let treasuryAdmin: &ElvnFUSDTreasury.ElvnAdministrator\n    let tokenReceiver: &{FungibleToken.Receiver}\n\n    prepare(signer: AuthAccount) {\n        self.treasuryAdmin = signer\n            .borrow<&ElvnFUSDTreasury.ElvnAdministrator>(from: /storage/treasuryElvnAdmin)\n            ?? panic(\"Signer is not the token admin\")\n\n        self.tokenReceiver = getAccount(recipient)\n            .getCapability(/public/elvnReceiver)\n            .borrow<&{FungibleToken.Receiver}>()\n            ?? panic(\"Unable to borrow receiver reference\")\n    }\n\n    execute {\n        self.tokenReceiver.deposit(from: <- self.treasuryAdmin.withdrawAllAmount())\n    }\n}\n";