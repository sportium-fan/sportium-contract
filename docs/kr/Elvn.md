# Elvn

Sportium 안에서 사용될 FungibleToken 입니다.
FUSD 와 1:1 가치를 띄우며, [ElvnFUSDTreasury](./ElvnFUSDTreasury.md) 로 부터 교환할 수 있습니다.

## Contract Address

| mainnet or testnet | address |
| -- | -- |
| mainnet | **0x6292b23b3eb3f999** |
| testnet | **0xe31f1a8c35b9bcac** |

## Scripts

### [Get Balance](../../scripts/elvn/get_balance.cdc)

- Address가 현재 가진 elvn balance를 확인할 수 있습니다.

#### GetBalance Example

```javascript
import * as fcl from "@onflow/fcl"
import { elvnGetBalance } from "sportium-contract"

const address: string = "0x..."

// return number
fcl.query({
 cadence: elvnGetBalance,
 args: (arg, t) => [
  arg(address, t.Address),
 ],
})
```

## Transactions

### [Transfer](../../transactions/elvn/transfer_tokens.cdc)
