"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyStorage = void 0;
exports.destroyStorage = `
import Pack from 0xPack

transaction {
    prepare(account: AuthAccount) {
		  let pack <- account
        .load<@Pack.Collection>(from: Pack.CollectionStoragePath)
        ?? panic("Not Found Pack.Collection Resource")

      destroy pack 
    }
}
`;
