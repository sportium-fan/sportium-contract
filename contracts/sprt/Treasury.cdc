import FungibleToken from "../std/FungibleToken.cdc"

// deprecated
pub contract Treasury {
	pub let vault: @FungibleToken.Vault

    pub event Initialize()

    pub event Withdrawn(amount: UFix64)

    pub event Deposited(amount: UFix64)

    pub resource Administrator {
		pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
			pre {
				amount > 0.0: "amount is not positive"
			}
			let vaultAmount = Treasury.vault.balance
			if vaultAmount < amount {
				panic("not enough balance in vault")
			}

				emit Withdrawn(amount: amount)
				return <- Treasury.vault.withdraw(amount: amount)
		}

		pub fun withdrawAllAmount(): @FungibleToken.Vault {
			let vaultAmount = Treasury.vault.balance
			if vaultAmount <= 0.0 {
				panic("not enough balance in vault")
			}

			emit Withdrawn(amount: vaultAmount)
			return <- Treasury.vault.withdraw(amount: vaultAmount)
		}
    }

    pub fun deposit(vault: @FungibleToken.Vault) {
		pre {
			vault.balance > 0.0: "amount is not positive"
		}
		let amount = vault.balance
		self.vault.deposit(from: <- vault)

		emit Deposited(amount: amount)
    }

    init(vault: @FungibleToken.Vault) { 
		self.vault <- vault

		let admin <- create Administrator()
		self.account.save(<- admin, to: /storage/treasuryAdmin)

		emit Initialize()
    }
}
 