export declare const getMoment = "import NonFungibleToken from 0xNonFungibleToken\n\nimport Moments from 0xMoments\n\npub struct AccountItem {\n  pub let itemID: UInt64\n  pub let metadata: {String: String}\n  pub let resourceID: UInt64\n  pub let owner: Address\n\n  init(itemID: UInt64, metadata: {String: String}, resourceID: UInt64, owner: Address) {\n    self.itemID = itemID\n    self.metadata = metadata\n    self.resourceID = resourceID\n    self.owner = owner\n  }\n}\n\npub fun main(address: Address, itemID: UInt64): AccountItem? {\n  if let collection = getAccount(address).getCapability<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath).borrow() {\n    if let item = collection.borrowMoment(id: itemID) {\n      return AccountItem(itemID: itemID, metadata: item.getMetadata(), resourceID: item.uuid, owner: address)\n    }\n  }\n\n  return nil\n}\n";
