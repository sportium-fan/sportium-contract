export declare const setupAccount = "import FungibleToken from 0xFungibleToken\nimport FUSD from 0xFUSD\n\ntransaction {\n\n  prepare(signer: AuthAccount) {\n\n    // It's OK if the account already has a Vault, but we don't want to replace it\n    if(signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) != nil) {\n      return\n    }\n  \n    // Create a new FUSD Vault and put it in storage\n    signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)\n\n    // Create a public capability to the Vault that only exposes\n    // the deposit function through the Receiver interface\n    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(\n      /public/fusdReceiver,\n      target: /storage/fusdVault\n    )\n\n    // Create a public capability to the Vault that only exposes\n    // the balance field through the Balance interface\n    signer.link<&FUSD.Vault{FungibleToken.Balance}>(\n      /public/fusdBalance,\n      target: /storage/fusdVault\n    )\n  }\n}\n";