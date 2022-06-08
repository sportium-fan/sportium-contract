
import AirdropElvn from "../../contracts/sprt/AirdropElvn.cdc"

transaction {
    prepare(account: AuthAccount) {
		let airdrop <- account
 	       .load<@AirdropElvn.Airdrop>(from: AirdropElvn.AirdropStoragePath)
 	       ?? panic("Not Found Pack.Collection Resource")
		
		destroy airdrop 
    }
}
