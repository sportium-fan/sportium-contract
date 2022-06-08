export const destroy = `
import AirdropElvn from 0xsprt/AirdropElvn

transaction {
    prepare(account: AuthAccount) {
		let airdrop <- account
 	       .load<@AirdropElvn.Airdrop>(from: AirdropElvn.AirdropStoragePath)
 	       ?? panic("Not Found Pack.Collection Resource")
		
		destroy airdrop 
    }
}
`;
