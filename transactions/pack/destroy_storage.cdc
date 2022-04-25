
import Pack from "../../contracts/Pack.cdc"

transaction {
    prepare(account: AuthAccount) {
		  let pack <- account
        .load<@Pack.Collection>(from: Pack.CollectionStoragePath)
        ?? panic("Not Found Pack.Collection Resource")

      destroy pack 
    }
}
