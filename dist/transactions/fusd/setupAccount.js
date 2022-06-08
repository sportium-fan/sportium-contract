"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAccount = void 0;
exports.setupAccount = `import FungibleToken from 0xstd/FungibleToken
import FUSD from 0xstd/FUSD

transaction {
  prepare(account: AuthAccount) {
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
}
`;
