export const mintWithDeopsit = `import FungibleToken from 0xFungibleToken

import Elvn from 0xElvn
import AirdropElvn from 0xAirdropElvn

transaction(amount: UFix64) {
    let tokenAdmin: &Elvn.Administrator

	let airdropAdmin: &AirdropElvn.Administrator

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer
        	.borrow<&Elvn.Administrator>(from: /storage/elvnAdmin)
        	?? panic("Signer is not the token admin")
		self.airdropAdmin = signer
			.borrow<&AirdropElvn.Administrator>(from: /storage/sportiumAirdropElvnAdmin)
			?? panic("Signer is not the airdrop admin")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let vault <- minter.mintTokens(amount: amount)

		self.airdropAdmin.depositElvn(vault: <-vault)
        destroy minter
    }
}
`;
