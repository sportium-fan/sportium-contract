"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAccount = void 0;
exports.initializeAccount = `import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FUSD from 0xFUSD
import Moments from 0xMoments
import Elvn from 0xElvn
import SprtNFTStorefront from 0xSprtNFTStorefront

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
}

transaction {
  prepare(account: AuthAccount) {
    setupFUSD(account: account)
    setupElvn(account: account)
    setupMoments(account: account)
    setupSprtStorefront(account: account)
  }
}
`;
