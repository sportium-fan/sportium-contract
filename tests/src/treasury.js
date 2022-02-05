import { mintFlow } from "flow-js-testing";
import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractByNameWithErrorRaised,
	getElvnAdminAddress,
} from "./common";
import { deployFUSD } from "./fusd";
import { deployElvn } from "./elvn";

export const deployElvnFeeTreasury = async () => {
	const ElvnAdmin = await getElvnAdminAddress();

	const addressMap = {
		Elvn: ElvnAdmin,
		NonFungibleToken: ElvnAdmin,
	};

	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "ElvnFeeTreasury", addressMap });
};

export const deployTreasury = async () => {
	const ElvnAdmin = await getElvnAdminAddress();
	await mintFlow(ElvnAdmin, "10.0");

	await deployFUSD();
	await deployElvn();
	await deployElvnFeeTreasury();

	const addressMap = {
		FUSD: ElvnAdmin,
		Elvn: ElvnAdmin,
		ElvnFeeTreasury: ElvnAdmin,
	};

	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "ElvnFUSDTreasury", addressMap });
};

export const getVaultBalance = async () => {
	const name = "treasury/get_vault_balance";

	return executeScriptWithErrorRaised({ name });
};

export const getFeeVaultBalance = async () => {
	const name = "treasury/get_fee_balance";

	return executeScriptWithErrorRaised({ name });
};

export const withdrawElvn = async (address, amount) => {
	const ElvnAdmin = await getElvnAdminAddress();
	const name = "treasury/withdraw_elvn";

	const args = [address, amount];
	const signers = [ElvnAdmin];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const withdrawAllElvn = async (address) => {
	const ElvnAdmin = await getElvnAdminAddress();
	const name = "treasury/all_amount_withdraw_elvn";

	const args = [address];
	const signers = [ElvnAdmin];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const withdrawFUSD = async (address, amount) => {
	const ElvnAdmin = await getElvnAdminAddress();
	const name = "treasury/withdraw_fusd";

	const args = [address, amount];
	const signers = [ElvnAdmin];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const withdrawAllFUSD = async (address) => {
	const ElvnAdmin = await getElvnAdminAddress();
	const name = "treasury/all_amount_withdraw_fusd";

	const args = [address];
	const signers = [ElvnAdmin];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const depositFUSD = async (account, amount) => {
	const name = "treasury/deposit_fusd";

	const args = [amount];
	const signers = [account];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const depositElvn = async (account, amount) => {
	const name = "treasury/deposit_elvn";

	const args = [amount];
	const signers = [account];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const swapElvnToFUSD = async (account, amount) => {
	const name = "treasury/swap_elvn_to_fusd";

	const args = [amount];
	const signers = [account];
	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const swapFUSDToElvn = async (account, amount) => {
	const name = "treasury/swap_fusd_to_elvn";

	const args = [amount];
	const signers = [account];
	return sendTransactionWithErrorRaised({ name, signers, args });
};
