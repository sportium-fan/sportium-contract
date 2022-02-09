export const initializeAccountTransaction = `import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FUSD from 0xFUSD
import Moments from 0xMoments 
import Elvn from 0xElvn
// import NFTStorefront from 0xNFTStorefront

pub fun hasFUSD(_ address: Address): Bool {
  let receiver = getAccount(address)
    .getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)
    .check()

  let balance = getAccount(address)
    .getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance)
    .check()

  return receiver && balance
}

pub fun hasElvn(_ address: Address): Bool {
  let receiver: Bool = getAccount(address)
    .getCapability<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver)
    .check()

  let balance: Bool = getAccount(address)
    .getCapability<&Elvn.Vault{FungibleToken.Balance}>(/public/elvnBalance)
    .check()

  return receiver && balance
}

pub fun hasItems(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath)
    .check()
}

// pub fun hasStorefront(_ address: Address): Bool {
//   return getAccount(address)
//     .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath)
//     .check()
// }

transaction {
  prepare(acct: AuthAccount) {
    if !hasFUSD(acct.address) {
      if acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
        acct.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)
      }
      acct.unlink(/public/fusdReceiver)
      acct.unlink(/public/fusdBalance)
      acct.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
      acct.link<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance, target: /storage/fusdVault)
    }

    if !hasElvn(acct.address) {
      if acct.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
        acct.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)
      }
      acct.unlink(/public/elvnReceiver)
      acct.unlink(/public/elvnBalance)
      acct.link<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver, target: /storage/elvnVault)
      acct.link<&Elvn.Vault{FungibleToken.Balance}>(/public/elvnBalance, target: /storage/elvnVault)
    }

    if !hasItems(acct.address) {
      if acct.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {
        acct.save(<-Moments.createEmptyCollection(), to: Moments.CollectionStoragePath)
      }
      acct.unlink(Moments.CollectionPublicPath)
      acct.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)
    }

    // if !hasStorefront(acct.address) {
    //   if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
    //     acct.save(<-NFTStorefront.createStorefront(), to: NFTStorefront.StorefrontStoragePath)
    //   }
    //   acct.unlink(NFTStorefront.StorefrontPublicPath)
    //   acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
    // }
  }
}
`;
