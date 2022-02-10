# Moments

Sportium MarketPlace에서 사용될 NonFungibleToken 입니다.

## Contract Address

| mainnet or testnet | address |
| -- | -- |
| mainnet | **0x6292b23b3eb3f999** |
| testnet | **0xe85ee62e8901ac6f** |

## Scripts

### [Get Collection Ids](../../scripts/moments/get_collection_ids.cdc)

- 사용자가 보유한 collections의 Id를 불러옵니다.

#### GetCollectionIds Example

```javascript
import * as fcl from "@onflow/fcl"
import { momentsGetCollectionIds } from "sportium-contract"

const address: string = "0x..."

// return [number]
fcl.query({
 cadence: momentsGetCollectionIds,
 args: (arg, t) => [
  arg(address, t.Address),
 ],
})
```

### [Get Moment](../../scripts/moments/get_moment.cdc)

- 사용자가 보유한 moment를 불러옵니다.

#### GetMoment Example

```javascript
import * as fcl from "@onflow/fcl"
import { momentsGetMoment } from "sportium-contract"

const address: string = "0x..."
const itemId: number = 0

// return {
//  itemID: number,
//  metadata: {
//   [key: string]: string
//  },
//  resourceID: number,
//  // address
//  owner: string
// }
fcl.query({
 cadence: momentsGetMoment,
 args: (arg, t) => [
  arg(address, t.Address),
  arg(itemId, t.UInt64),
 ],
})
```

## Transactions

### [Transfer Moment](../../transactions/moments/transfer_moment.cdc)
