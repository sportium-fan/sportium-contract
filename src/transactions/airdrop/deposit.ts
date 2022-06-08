export const deposit = `import FungibleToken from 0xstd/FungibleToken

import Elvn from 0xsprt/Elvn
import AirdropElvn from 0xsprt/AirdropElvn

transaction(amount: UFix64) {
	let airdropAdmin: &AirdropElvn.Administrator

    let sentVault: @Elvn.Vault

    prepare(signer: AuthAccount) {
		self.airdropAdmin = signer
			.borrow<&AirdropElvn.Administrator>(from: /storage/sportiumAirdropElvnAdmin)
			?? panic("Signer is not the airdrop admin")

        let vaultRef = signer.borrow<&Elvn.Vault>(from: /storage/elvnVault)
        ?? panic("Could not borrow reference to the owner's Vault!")

        self.sentVault <- (vaultRef.withdraw(amount: amount) as! @Elvn.Vault)
    }

    execute {
		self.airdropAdmin.depositElvn(vault: <-self.sentVault)
    }
}
`;
