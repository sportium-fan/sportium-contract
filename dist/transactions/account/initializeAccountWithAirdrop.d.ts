export declare const initializeAccountWithAirdrop = "import FungibleToken from 0xFungibleToken\nimport NonFungibleToken from 0xNonFungibleToken\nimport FUSD from 0xFUSD\n\nimport Moments from 0xMoments\nimport Elvn from 0xElvn\nimport SprtNFTStorefront from 0xSprtNFTStorefront\nimport Pack from 0xPack\nimport AirdropElvn from 0xAirdropElvn\n\nimport TeleportedSportiumToken from 0xTeleportedSportiumToken\n\npub fun setupFUSD(account: AuthAccount)  {\n  if account.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {\n    account.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)\n\n    account.link<&FUSD.Vault{FungibleToken.Receiver}>(\n      /public/fusdReceiver,\n      target: /storage/fusdVault\n    )\n\n    account.link<&FUSD.Vault{FungibleToken.Balance}>(\n      /public/fusdBalance,\n      target: /storage/fusdVault\n    )\n  }\n}\n\npub fun setupElvn(account: AuthAccount) {\n  if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {\n    account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)\n\n    account.link<&Elvn.Vault{FungibleToken.Receiver}>(\n        /public/elvnReceiver,\n        target: /storage/elvnVault\n    )\n\n    account.link<&Elvn.Vault{FungibleToken.Balance}>(\n        /public/elvnBalance,\n        target: /storage/elvnVault\n    )\n  }\n}\n\npub fun setupMoments(account: AuthAccount) {\n  if account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {\n      let collection <- Moments.createEmptyCollection()\n      account.save(<-collection, to: Moments.CollectionStoragePath)\n\n      account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)\n  }\n}\n\npub fun setupSprtStorefront(account: AuthAccount)  {\n  if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {\n      let storefront <- SprtNFTStorefront.createStorefront()\n      account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)\n\n      account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)\n  }\n\n  let storefront = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)!\n  storefront.saveAddress()\n}\n\npub fun setupPack(account: AuthAccount) {\n  if account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) == nil {\n    let collection <- Pack.createEmptyCollection()\n    account.save(<-collection, to: Pack.CollectionStoragePath)\n\n    account.link<&Pack.Collection{Pack.PackCollectionPublic}>(Pack.CollectionPublicPath, target: Pack.CollectionStoragePath)\n  }\n}\n\npub fun setupSportium(account: AuthAccount) {\n  if account.borrow<&TeleportedSportiumToken.Vault>(from: TeleportedSportiumToken.TokenStoragePath) == nil {\n    account.save(<-TeleportedSportiumToken.createEmptyVault(), to: TeleportedSportiumToken.TokenStoragePath)\n\n    account.link<&TeleportedSportiumToken.Vault{FungibleToken.Receiver}>(\n        TeleportedSportiumToken.TokenPublicReceiverPath,\n        target: TeleportedSportiumToken.TokenStoragePath \n    )\n\n    account.link<&TeleportedSportiumToken.Vault{FungibleToken.Balance}>(\n        TeleportedSportiumToken.TokenPublicBalancePath,\n        target: TeleportedSportiumToken.TokenStoragePath \n    )\n  }\n}\n\npub fun setupAirdropElvn(account: AuthAccount) {\n  if account.borrow<&AirdropElvn.Airdrop>(from: AirdropElvn.AirdropStoragePath) == nil {\n    let airdrop <- AirdropElvn.createEmptyAirdrop()\n    account.save(<- airdrop, to: AirdropElvn.AirdropStoragePath)\n  }\n\n  let airdrop = account.borrow<&AirdropElvn.Airdrop>(from: AirdropElvn.AirdropStoragePath)!\n  let vault <- airdrop.saveWhiteList()\n\n  if vault != nil {\n    let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)!\n    vaultRef.deposit(from: <- vault!)\n  } else {\n    destroy vault\n  }\n}\n\ntransaction {\n  prepare(account: AuthAccount) {\n    setupFUSD(account: account)\n    setupElvn(account: account)\n    setupMoments(account: account)\n    setupSprtStorefront(account: account)\n    setupPack(account: account)\n    setupSportium(account: account)\n    setupAirdropElvn(account: account)\n  }\n}\n";
