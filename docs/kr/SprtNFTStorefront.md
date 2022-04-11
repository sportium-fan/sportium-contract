# SprtNFTStorefront

Sportium MarketPlace

## Contract Address

| mainnet or testnet | address |
| -- | -- |
| mainnet | **null** |
| testnet | **0x357ae2acb94b606b** |

## Scripts

### [Get Listings](../../scripts/sprtNftStorefront/get_listings.cdc)

- 사용자가 보유한 listing ids를 불러옵니다.
- listing = MarketPlace에 올리기 위해 NFT를 한번 wrapping한 구조체입니다.

#### GetListings Use case

1. 사용자는 본인이 MarketPlace올린 Listing 목록을 알 수 있습니다.

#### GetListings Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontGetListings } from "sportium-contract"

const address: string = "0x..."

// return [number]
fcl.query({
 cadence: sprtNftStorefrontGetListings,
 args: (arg, t) => [
  arg(address, t.Address),
 ],
})
```

### [Get Listing](../../scripts/sprtNftStorefront/get_listing.cdc)

- 사용자가 보유한 listing 중 명시한 resource Id의 detail 내역을 가져옵니다.

#### GetListing Use case

1. 사용자는 본인이 올린 Listing의 detail 정보를 알 수 있습니다.

#### GetListing Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontGetListings } from "sportium-contract"

const address: string = "0x..."
const listingResourceId: number = 0

// return {
//  storefrontID: number,
//  purchased: bool,
//  nftType: string,
//  nftId: number,
//  salePaymentVaultType: string,
//  salePrice: number,
//  saleCuts: [{
//   receiver: unknown,
//   amount: number
//  }]
// }
fcl.query({
 cadence: sprtNftStorefrontGetListings,
 args: (arg, t) => [
  arg(address, t.Address),
  arg(listingResourceId, t.UInt64)
 ],
})
```

### [Get Listing Item](../../scripts/sprtNftStorefront/get_listing_item.cdc)

- 사용자가 보유한 listing 중 명시한 resource Id의 detail 내역을 가져옵니다.
- `Get Listing`과는 return type만 다를뿐 이외는 같습니다.

#### GetListingItem Use case

1. 사용자는 본인이 올린 Listing의 detail 정보를 알 수 있습니다.

#### GetListingItem Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontGetListingItem } from "sportium-contract"

const address: string = "0x..."
const listingResourceId: number = 0

// return {
//  itemId: number
//  metadata: {
//   [key: string]: string
//  },
//  owner: string,
//  price: number
// }
fcl.query({
 cadence: sprtNftStorefrontGetListingItem,
 args: (arg, t) => [
  arg(address, t.Address),
  arg(listingResourceId, t.UInt64)
 ],
})
```

### [GetAddressList](../../scripts/sprtNftStorefront/get_address_list.cdc)

#### GetAddressList Use Case

1. 사용자는 현재까지 저장된 `SprtNFTStorefront`를 만든 유저의 주소들을 알 수 있습니다.

#### GetAddressList Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontGetAddressList } from "sportium-contract"

const address: string = "0x..."

// return string[]
fcl.query({
 cadence: sprtNftStorefrontGetAddressList,
 args: (arg, t) => [
  arg(address, t.Address),
 ],
})
```

### [GetAddress](../../scripts/sprtNftStorefront/get_address.cdc)

#### GetAddress Use Case

1. 사용자는 StorefrontId를 Address로 변환할 수 있습니다.

#### GetAddress Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontGetAddress } from "sportium-contract"

const storefrontId: number = 0

// return string
fcl.query({
 cadence: sprtNftStorefrontGetAddress,
 args: (arg, t) => [
  arg(storefrontId, t.UInt64),
 ],
})
```

## Transactions

### [Create Listing](../../transactions/sprtNftStorefront/create_listing.cdc)

- MarketPlace에 NFT를 등록합니다.
- 거래 통화는 Elvn입니다.

#### CreateListing Use case

1. 사용자는 MarketPlace에 NFT를 등록할 수 있습니다.

#### CreateListing Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontCreateListing } from "sportium-contract"

// nftID
const saleItemId: number = 0
const price: number = 10

fcl.mutate({
 cadence: sprtNftStorefrontCreateListing,
 args: (arg, t) => [
  arg(saleItemId, t.UFix64),
  arg(price.toFixed(8), t.UFix64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Cleanup Listing](../../transactions/sprtNftStorefront/cleanup_listing.cdc)

- 유령 Listing을 지웁니다.
- NftStorefront 구현상 listing을 여러개 올릴 수 있어서,
- 위와 같은 경우 N개 Listing 을 올렸을때, 하나의 listing이 구매되면, 나머지는 유령 Listing이 됩니다.

#### CleanupListing Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontCleanupListing } from "sportium-contract"

const listingResourceId: number = 0
// user address
const storefrontAddress: string = "0x..."

fcl.mutate({
 cadence: sprtNftStorefrontCleanupListing,
 args: (arg, t) => [
  arg(listingResourceId, t.UInt64),
  arg(storefrontAddress, t.Address),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Purchase Listing](../../transactions/sprtNftStorefront/purchase_listing.cdc)

- MarketPlace에 등록되어 있는 Listing을 구매합니다.
- Elvn으로 구매합니다.

#### PurchaseListing Use case

1. 사용자는 MarketPlace에 올라와 있는 NFT를 Elvn으로 구매할 수 있습니다.

#### PurchaseListing Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontPurchaseListing } from "sportium-contract"

const listingResourceId: number = 0
// user address
const storefrontAddress: string = "0x..."

fcl.mutate({
 cadence: sprtNftStorefrontPurchaseListing,
 args: (arg, t) => [
  arg(listingResourceId, t.UInt64),
  arg(storefrontAddress, t.Address),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Purchase Listing Payment By FUSD](../../transactions/sprtNftStorefront/purchase_listing_payment_by_fusd.cdc)

- MarketPlace에 등록되어 있는 Listing을 구매합니다.
- FUSD를 Elvn으로 바꾼뒤 Listing을 구매합니다.

#### PurchaseListingPaymentByFUSD Use case

1. 사용자는 MarketPlace에 올라와 있는 NFT를 FUSD로 구매할 수 있습니다.

#### PurchaseListingPaymentByFUSD Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontPurchaseListingPaymentByFusd } from "sportium-contract"

const listingResourceId: number = 0
// user address
const storefrontAddress: string = "0x..."

fcl.mutate({
 cadence: sprtNftStorefrontPurchaseListingPaymentByFusd,
 args: (arg, t) => [
  arg(listingResourceId, t.UInt64),
  arg(storefrontAddress, t.Address),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Remove Listing](../../transactions/sprtNftStorefront/remove_listing.cdc)

- MarketPlace에 등록되어 있는 Listing을 취소합니다.

#### RemoveListing Use case

1. 사용자는 MarketPlace에 올라와 있는 NFT를 취소할 수 있습니다.

#### RemoveListing Example

```javascript
import * as fcl from "@onflow/fcl"
import { sprtNftStorefrontRemoveListing } from "sportium-contract"

const listingResourceId: number = 0

fcl.mutate({
 cadence: sprtNftStorefrontRemoveListing,
 args: (arg, t) => [
  arg(listingResourceId, t.UInt64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```
