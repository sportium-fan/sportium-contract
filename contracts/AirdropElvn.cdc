import FungibleToken from "./FungibleToken.cdc"

import Elvn from "./Elvn.cdc"

pub contract AirdropElvn {
	access(self) let vault: @Elvn.Vault
	access(self) let whitelist: {Address: Bool}
	access(self) var amount: UFix64

    pub let AirdropStoragePath: StoragePath

	pub resource Airdrop {
		pub fun saveWhiteList(): @FungibleToken.Vault? {
			pre {
				self.owner?.address != nil: "Only owner can save white list"
			}

			if AirdropElvn.checkAidropReceived(address: self.owner?.address!) {
				return nil
			}

			AirdropElvn.whitelist[self.owner?.address!] = true
			return <- AirdropElvn.vault.withdraw(amount: AirdropElvn.amount)
		}
	}

	pub fun getAmmount(): UFix64 {
		return self.amount
	}

	pub fun checkAidropReceived(address: Address): Bool {
		return self.whitelist[address] != nil && self.whitelist[address] == true
	}

	pub fun createEmptyAirdrop(): @Airdrop {
		return <- create Airdrop()
	}

	pub resource Administrator {
		pub fun disableWhitelist(address: Address)  {
			AirdropElvn.whitelist[address] = false
		}

		pub fun depositElvn(vault: @Elvn.Vault) {
			AirdropElvn.vault.deposit(from: <- vault)
		}

		pub fun changeAirdropAmount(amount: UFix64) {
			AirdropElvn.amount = amount
		}
	}

	init () {
		self.vault <- Elvn.createEmptyVault() as! @Elvn.Vault
		self.whitelist = {}

		self.amount = 500.0

        let admin <- create Administrator()
        self.account.save(<-admin, to: /storage/sportiumAirdropElvnAdmin)

		self.AirdropStoragePath = /storage/sportiumAirdropElvnForTestnet
	}
}
