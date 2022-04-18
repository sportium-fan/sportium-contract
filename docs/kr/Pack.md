# Pack

[Moment(NFT)](./Moment.md)들을 가지고 있는 Token 입니다. releaseId를 기준으로 가격이 정해집니다.

- Contract로 부터 [Elvn](./Elvn.md)을 지불하여 구매할 수 있습니다.
- 구매한 Pack은 사용자에게 귀속되며, [`open_pack`](../../transactions/pack/open_pack.cdc) transaction 을 실행 시키면, 저장되어 있는 [Moments](./Moments.md)로 변환됩니다.

## Contract Address

| mainnet or testnet | address |
| -- | -- |
| mainnet | **null** |
| testnet | **0xe8f6dc7f3c13c0a0** |

## Scripts

### [GetPackPrice](../../scripts/pack/get_pack_price.cdc)

#### GetPackPrice Use Case

1. 사용자는 releaseId를 입력하여, Pack Price를 알 수 있습니다.

#### GetPackPrice Example

```javascript
import * as fcl from "@onflow/fcl"
import { packGetPackPrice } from "sportium-contract"

const releaseId: number = 0

// return number
fcl.query({
 cadence: packGetPackPrice,
 args: (arg, t) => [
  arg(releaseId, t.UInt64),
 ],
})
```

### [GetPackRemainingCount](../../scripts/pack/get_pack_remaining_count.cdc)

#### GetPackRemainingCount Use Case

1. 사용자는 releaseId를 입력하여, 남은 pack 개수를 알 수 있습니다.

#### GetPackRemainingCount Example

```javascript
import * as fcl from "@onflow/fcl"
import { packGetPackRemainingCount } from "sportium-contract"

const releaseId: number = 0

// return number
fcl.query({
 cadence: packGetPackRemainingCount,
 args: (arg, t) => [
  arg(releaseId, t.UInt64),
 ],
})
```

### [GetMomentsListRemainingCount](../../scripts/pack/get_moments_list_remaining_count.cdc)

#### GetMomentsListRemainingCount Use Case

1. 사용자는 releaseId를 입력하여, 남은 moments List 개수를 알 수 있습니다.

#### GetMomentsListRemainingCount Example

```javascript
import * as fcl from "@onflow/fcl"
import { packGetMomentsListRemainingCount } from "sportium-contract"

const releaseId: number = 0

// return number
fcl.query({
 cadence: packGetMomentsListRemainingCount,
 args: (arg, t) => [
  arg(releaseId, t.UInt64),
 ],
})
```

### [GetCollectionIds](../../scripts/pack/get_collection_ids.cdc)

#### GetCollectionIds Use Case

1. 사용자는 입력한 주소가 보유한 Pack Id들을 알 수 있습니다.

#### GetCollectionIds Example

```javascript
import * as fcl from "@onflow/fcl"
import { packGetCollectionIds } from "sportium-contract"

const address: string = "0x"

// return number[]
fcl.query({
 cadence: packGetCollectionIds,
 args: (arg, t) => [
  arg(address, t.Address),
 ],
})
```

### [GetOnSaleReleaseIds](../../scripts/pack/get_on_sale_release_ids.cdc)

#### GetOnSaleReleaseIds Use Case

1. 사용자는 현재 판매중인 팩의 release id들을 알 수 있습니다.

#### GetOnSaleReleaseIds Example

```javascript
import * as fcl from "@onflow/fcl"
import { packGetOnSaleReleaseIds } from "sportium-contract"

// return number[]
fcl.query({
 cadence: packGetOnSaleReleaseIds,
})
```

#### GetReleaseIds Use Case

1. 사용자는 현재 보유 중인 release id들을 알 수 있습니다.

#### GetReleaseIds Example

```javascript
import * as fcl from "@onflow/fcl"
import { packGetReleaseIds } from "sportium-contract"

// return number[]
fcl.query({
 cadence: packGetReleaseIds,
})
```

## Transactions

### [BuyPack](../../transactions/pack/add_pack.cdc)

#### BuyPack Use Case

1. 사용자는 Pack Contract로 부터 Elvn으로 `Pack.Token`을 구매할 수 있습니다.

#### BuyPack Example

```javascript
import { packBuyPack } from "sportium-contract"

const releaseId: number = 0

fcl.mutate({
 cadence: packBuyPack,
 args: (arg, t) => [
  arg(releaseId, t.UInt64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [BuyPackPaymentByFUSD](../../transactions/pack/buy_pack_payment_by_fusd.cdc)

#### BuyPackPaymentByFUSD Use Case

1. 사용자는 Pack Contract로 부터 FUSD로 `Pack.Token`을 구매할 수 있습니다.

#### BuyPackPaymentByFUSD Example

```javascript
import { packBuyPackPaymentByFusd } from "sportium-contract"

const releaseId: number = 0

fcl.mutate({
 cadence: packBuyPackPaymentByFusd,
 args: (arg, t) => [
  arg(releaseId, t.UInt64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [OpenPackId](../../transactions/pack/open_pack_id.cdc)

#### OpenPackId Use Case

1. 사용자는 Pack Id를 넣어서, Pack으로부터 Moments를 얻을 수 있습니다.

#### OpenPackId Example

```javascript
import { packOpenPackId } from "sportium-contract"

const packId: number = 0

fcl.mutate({
 cadence: packOpenPackId,
 args: (arg, t) => [
  arg(packId, t.UInt64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [OpenPackReleaseId](../../transactions/pack/open_pack_release_id.cdc)

#### OpenPackReleaseId Use Case

1. 사용자는 ReleaseId를 넣어서, Pack으로부터 Moments를 얻을 수 있습니다.

#### OpenPackReleaseId Example

```javascript
import { packOpenPackReleaseId } from "sportium-contract"

const releaseId: number = 0

fcl.mutate({
 cadence: packOpenPackReleaseId,
 args: (arg, t) => [
  arg(releaseId, t.UInt64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```
