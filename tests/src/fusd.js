import { mintFlow } from "flow-js-testing";
import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractByNameWithErrorRaised,
	getElvnAdminAddress,
} from "./common";

/*
 * Deploys FUSD contract to ElvnAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployFUSD = async () => {
	const ElvnAdmin = await getElvnAdminAddress();
	await mintFlow(ElvnAdmin, "10.0");

	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "FUSD" });
};

/*
 * Setups FUSD Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupFUSDOnAccount = async (account) => {
	const name = "fusd/setup_account";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

/*
 * Returns FUSD balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getFUSDBalance = async (account) => {
	const name = "fusd/get_balance";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};

export const mintFUSD = async (recipient, amount) => {
	const ElvnAdmin = await getElvnAdminAddress();

	const name = "fusd/mint_tokens";
	const args = [recipient, amount];
	const signers = [ElvnAdmin];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

export const transferFUSD = async (sender, recipient, amount) => {
	const name = "fusd/transfer_tokens";
	const args = [amount, recipient];
	const signers = [sender];

	return sendTransactionWithErrorRaised({ name, args, signers });
};
