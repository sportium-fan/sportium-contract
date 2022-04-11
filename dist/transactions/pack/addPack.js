"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPack = void 0;
exports.addPack = `import Pack from 0xPack

transaction(packId: UInt64) {
    let admin: &Pack.Administrator
    let packCollectionRef: &Pack.Collection

    prepare(account: AuthAccount) {
        self.admin = account
            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)
            ?? panic("Signer is not the pack admin")
        
        self.packCollectionRef = account
            .borrow<&Pack.Collection>(from: Pack.CollectionStoragePath)
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
		let pack <- self.packCollectionRef.withdraw(withdrawID: packId)		
		self.admin.addPack(token: <- pack)
    }
}
`;
