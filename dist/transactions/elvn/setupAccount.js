"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAccount = void 0;
exports.setupAccount = `import FungibleToken from 0xFungibleToken
import Elvn from 0xElvn

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the Elvn

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
            // Create a new Elvn Vault and put it in storage
            signer.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)

            // Create a public capability to the stored Vault that only exposes
            // the deposit method through the Receiver interface
            //
            signer.link<&Elvn.Vault{FungibleToken.Receiver}>(
                /public/elvnReceiver,
                target: /storage/elvnVault
            )

            // Create a public capability to the stored Vault that only exposes
            // the balance field through the Balance interface
            //
            signer.link<&Elvn.Vault{FungibleToken.Balance}>(
                /public/elvnBalance,
                target: /storage/elvnVault
            )
        }
    }
}
`;
