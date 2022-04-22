export const destroyStorage = `
import Pack from 0xPack

transaction {
    prepare(account: AuthAccount) {
		  let storefront <- account
        .load<@Pack.Token>(from: Pack.CollectionStoragePath)
        ?? panic("Not Found Pack.Storefront Resource")

      destroy storefront
    }
}
`;
