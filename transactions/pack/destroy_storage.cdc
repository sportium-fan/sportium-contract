
import Pack from "../../contracts/sprt/Pack.cdc"

transaction {
    prepare(account: AuthAccount) {
      account.unlink(Pack.CollectionPublicPath)

		  let pack <- account
        .load<@Pack.Collection>(from: Pack.CollectionStoragePath)
        ?? panic("Not Found Pack.Collection Resource")

      destroy pack 
    }
}
