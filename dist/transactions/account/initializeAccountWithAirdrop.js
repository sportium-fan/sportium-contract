"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAccountWithAirdrop = void 0;
exports.initializeAccountWithAirdrop = `import FungibleToken from 0xstd/FungibleToken
import NonFungibleToken from 0xstd/NonFungibleToken
import FUSD from 0xstd/FUSD

import Moments from 0xsprt/Moments
import Elvn from 0xsprt/Elvn
import SprtNFTStorefront from 0xsprt/SprtNFTStorefront
import Pack from 0xsprt/Pack
import AirdropElvn from 0xsprt/AirdropElvn

import TeleportedSportiumToken from 0xblocto/TeleportedSportiumToken

pub fun setupFUSD(account: AuthAccount)  {
  if account.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
    account.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

    account.link<&FUSD.Vault{FungibleToken.Receiver}>(
      /public/fusdReceiver,
      target: /storage/fusdVault
    )

    account.link<&FUSD.Vault{FungibleToken.Balance}>(
      /public/fusdBalance,
      target: /storage/fusdVault
    )
  }
}

pub fun setupElvn(account: AuthAccount) {
  if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
    account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)

    account.link<&Elvn.Vault{FungibleToken.Receiver}>(
        /public/elvnReceiver,
        target: /storage/elvnVault
    )

    account.link<&Elvn.Vault{FungibleToken.Balance}>(
        /public/elvnBalance,
        target: /storage/elvnVault
    )
  }
}

pub fun setupMoments(account: AuthAccount) {
  if account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {
      let collection <- Moments.createEmptyCollection()
      account.save(<-collection, to: Moments.CollectionStoragePath)

      account.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)
  }
}

pub fun setupSprtStorefront(account: AuthAccount)  {
  if account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath) == nil {
      let storefront <- SprtNFTStorefront.createStorefront()
      account.save(<-storefront, to: SprtNFTStorefront.StorefrontStoragePath)

      account.link<&SprtNFTStorefront.Storefront{SprtNFTStorefront.StorefrontPublic}>(SprtNFTStorefront.StorefrontPublicPath, target: SprtNFTStorefront.StorefrontStoragePath)
  }

  let storefront = account.borrow<&SprtNFTStorefront.Storefront>(from: SprtNFTStorefront.StorefrontStoragePath)!
  storefront.saveAddress()
}

pub fun setupPack(account: AuthAccount) {
  if account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) == nil {
    let collection <- Pack.createEmptyCollection()
    account.save(<-collection, to: Pack.CollectionStoragePath)

    account.link<&Pack.Collection{Pack.PackCollectionPublic}>(Pack.CollectionPublicPath, target: Pack.CollectionStoragePath)
  }
}

pub fun setupSportium(account: AuthAccount) {
  if account.borrow<&TeleportedSportiumToken.Vault>(from: TeleportedSportiumToken.TokenStoragePath) == nil {
    account.save(<-TeleportedSportiumToken.createEmptyVault(), to: TeleportedSportiumToken.TokenStoragePath)

    account.link<&TeleportedSportiumToken.Vault{FungibleToken.Receiver}>(
        TeleportedSportiumToken.TokenPublicReceiverPath,
        target: TeleportedSportiumToken.TokenStoragePath 
    )

    account.link<&TeleportedSportiumToken.Vault{FungibleToken.Balance}>(
        TeleportedSportiumToken.TokenPublicBalancePath,
        target: TeleportedSportiumToken.TokenStoragePath 
    )
  }
}

pub fun setupAirdropElvn(account: AuthAccount) {
  if account.borrow<&AirdropElvn.Airdrop>(from: AirdropElvn.AirdropStoragePath) == nil {
    let airdrop <- AirdropElvn.createEmptyAirdrop()
    account.save(<- airdrop, to: AirdropElvn.AirdropStoragePath)
  }

  let airdrop = account.borrow<&AirdropElvn.Airdrop>(from: AirdropElvn.AirdropStoragePath)!
  let vault <- airdrop.saveWhiteList()

  if vault != nil {
    let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)!
    vaultRef.deposit(from: <- vault!)
  } else {
    destroy vault
  }
}

transaction {
  prepare(account: AuthAccount) {
    setupFUSD(account: account)
    setupElvn(account: account)
    setupMoments(account: account)
    setupSprtStorefront(account: account)
    setupPack(account: account)
    setupSportium(account: account)
    setupAirdropElvn(account: account)
  }
}
`;
