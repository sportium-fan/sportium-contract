import { mintFlow } from "flow-js-testing";
import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractByNameWithErrorRaised,
	getElvnAdminAddress,
} from "./common";

/**
 * Deploys Elvn contract to ElvnAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const deployElvn = async () => {
	const ElvnAdmin = await getElvnAdminAddress();
	await mintFlow(ElvnAdmin, "10.0");

	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "Elvn" });
};

/**
 * Setups Elvn Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const setupElvnOnAccount = async (account) => {
	const name = "elvn/setup_account";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

/**
 * Returns Elvn balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 */
export const getElvnBalance = async (account) => {
	const name = "elvn/get_balance";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};

/**
 * Returns Elvn supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 */
export const getElvnSupply = async () => {
	const name = "elvn/get_supply";
	return executeScriptWithErrorRaised({ name });
};

/**
 * Mints **amount** of Elvn tokens and transfers them to recipient.
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to mint
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const mintElvn = async (recipient, amount) => {
	const ElvnAdmin = await getElvnAdminAddress();

	const name = "elvn/mint_tokens";
	const args = [recipient, amount];
	const signers = [ElvnAdmin];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/**
 * Transfers **amount** of Elvn tokens from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to transfer
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const transferElvn = async (sender, recipient, amount) => {
	const name = "elvn/transfer_tokens";
	const args = [amount, recipient];
	const signers = [sender];

	return sendTransactionWithErrorRaised({ name, args, signers });
};
