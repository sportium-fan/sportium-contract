export const getMoment = `import NonFungibleToken from 0xNonFungibleToken
import Moments from 0xMoments

pub struct AccountItem {
  pub let itemID: UInt64
  pub let metadata: {String: String}
  pub let resourceID: UInt64
  pub let owner: Address

  init(itemID: UInt64, metadata: {String: String}, resourceID: UInt64, owner: Address) {
    self.itemID = itemID
    self.metadata = metadata
    self.resourceID = resourceID
    self.owner = owner
  }
}

pub fun main(address: Address, itemID: UInt64): AccountItem? {
  if let collection = getAccount(address).getCapability<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath).borrow() {
    if let item = collection.borrowMoment(id: itemID) {
      return AccountItem(itemID: itemID, metadata: item.getMetadata(), resourceID: item.uuid, owner: address)
    }
  }

  return nil
}
`;
