"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawElvn = void 0;
exports.withdrawElvn = `import Pack from 0xPack
import Elvn from 0xElvn

transaction(amount: UFix64?) {
    let admin: &Pack.Administrator

	let vaultRef: &Elvn.Vault

    prepare(account: AuthAccount) {
        self.admin = account
            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)
            ?? panic("Signer is not the pack admin")
		
		self.vaultRef = account
			.borrow<&Elvn.Vault>(from: /storage/elvnVault)
			?? panic("Not found elvnVault")
    }

    execute {
		let vault <- self.admin.withdraw(amount: amount)
		self.vaultRef.deposit(from: <- vault)
    }
}
`;
