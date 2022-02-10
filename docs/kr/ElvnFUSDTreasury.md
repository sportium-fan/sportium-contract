# ElvnFUSDTreasury

Elvn, FUSD 금고를 들고 있는 contract 입니다.
여기서 swap transaction 을 사용하면 아래와 같이 변환할 수 있습니다.

fusd:elvn = 1:1

- fusd -> elvn
- elvn -> fusd

## Contract Address

| mainnet or testnet | address |
| -- | -- |
| mainnet | **0x6292b23b3eb3f999** |
| testnet | **0x0c5291c8e8c6c25a** |

## Scripts

## Transactions

### [Deposit Elvn](../../transactions/treasury/deposit_elvn.cdc)

- 사용자가 보유한 Elvn을 지정한 amount 만큼 treasury에 전송합니다.

#### DepositElvn Use case

1. 팩 구매

#### DepositElvn Example

```javascript
import * as fcl from "@onflow/fcl"
import { treasuryDepositElvn } from "sportium-contract"

const amount: number = 10

fcl.mutate({
 cadence: treasuryDepositElvn,
 args: (arg, t) => [
  arg(amount.toFixed(8), t.UFix64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Deposit FUSD](../../transactions/treasury/deposit_fusd.cdc)

- 사용자가 보유한 FUSD을 지정한 amount 만큼 treasury에 전송합니다.

#### DepositFUSD Use case

1. 팩 구매

#### DepositFUSD Example

```javascript
import * as fcl from "@onflow/fcl"
import { treasuryDepositFusd } from "sportium-contract"

const amount: number = 10

fcl.mutate({
 cadence: treasuryDepositFusd,
 args: (arg, t) => [
  arg(amount.toFixed(8), t.UFix64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Swap FUSD to Elvn](../../transactions/treasury/swap_elvn_to_fusd.cdc)

- 지정한 amount 만큼 사용자가 보유한 FUSD를 Elvn으로 교환합니다.
- Elvn:FUSD 는 항상 1:1 입니다.

#### SwapFUSDToElvn Use case

1. fusd를 elvn으로 교환하는 버튼 이외는 사용될 상황이 없습니다.

#### SwapFUSDToElvn Example

```javascript
import * as fcl from "@onflow/fcl"
import { treasurySwapFusdToElvn } from "sportium-contract"

const amount: number = 10

fcl.mutate({
 cadence: treasurySwapFusdToElvn,
 args: (arg, t) => [
  arg(amount.toFixed(8), t.UFix64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```

### [Swap Elvn to FUSD](../../transactions/treasury/swap_elvn_to_fusd.cdc)

- 지정한 amount 만큼 사용자가 보유한 Elvn을 FUSD로 교환합니다.
- Elvn:FUSD 는 항상 1:1 입니다.

#### SwapElvnToFUSD Use case

1. FUSD 출금

#### SwapElvnToFUSD Example

```javascript
import * as fcl from "@onflow/fcl"
import { treasurySwapElvnToFusd } from "sportium-contract"

const amount: number = 10

fcl.mutate({
 cadence: treasurySwapElvnToFusd,
 args: (arg, t) => [
  arg(amount.toFixed(8), t.UFix64),
 ],
 // authorizations: [authorization],
 // payer: authorization,
 // proposer: authorization,
})
```
