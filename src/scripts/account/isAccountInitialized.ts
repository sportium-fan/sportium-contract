export const isAccountInitialized = `import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSD
import NonFungibleToken from 0xNonFungibleToken

import Moments from 0xMoments
import Elvn from 0xElvn

pub fun hasFUSD(_ address: Address): Bool {
  let receiver: Bool = getAccount(address)
    .getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)
    .check()

  let balance: Bool = getAccount(address)
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

pub fun main(address: Address): {String: Bool} {
  let ret: {String: Bool} = {}
  ret["FUSD"] = hasFUSD(address)
  ret["Moments"] = hasItems(address)
  ret["Elvn"] = hasElvn(address)
  return ret
}
`;
