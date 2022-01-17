import { mintFlow } from "flow-js-testing";
import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractByNameWithErrorRaised,
	getElvnAdminAddress,
} from "./common";

export const types = {
	fishbowl: 1,
	fishhat: 2,
	milkshake: 3,
	tuktuk: 4,
	skateboard: 5,
	shades: 6,
};

export const rarities = {
	blue: 1,
	green: 2,
	purple: 3,
	gold: 4,
};

/*
 * Deploys NonFungibleToken and Moments contracts to ElvnAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployMoments = async () => {
	const ElvnAdmin = await getElvnAdminAddress();
	await mintFlow(ElvnAdmin, "10.0");

	await deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "NonFungibleToken" });

	const addressMap = { NonFungibleToken: ElvnAdmin };
	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "Moments", addressMap });
};

/*
 * Setups Moments collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupMomentsOnAccount = async (account) => {
	const name = "moments/setup_account";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

/*
 * Returns Moments supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getMomentSupply = async () => {
	const name = "moments/get_moments_supply";

	return executeScriptWithErrorRaised({ name });
};

/*
 * Mints Moment of a specific **itemType** and sends it to **recipient**.
 * @param {UInt64} itemType - type of NFT to mint
 * @param {string} recipient - recipient account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const mintMoment = async (recipient, itemType, itemRarity) => {
	const ElvnAdmin = await getElvnAdminAddress();

	const name = "moments/mint_moment";
	const args = [recipient, itemType, itemRarity];
	const signers = [ElvnAdmin];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/*
 * Transfers Moment NFT with id equal **itemId** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const transferMoment = async (sender, recipient, itemId) => {
	const name = "moments/transfer_moment";
	const args = [recipient, itemId];
	const signers = [sender];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/*
 * Returns the Moment NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getMoment = async (account, itemID) => {
	const name = "moments/get_moment";
	const args = [account, itemID];

	return executeScriptWithErrorRaised({ name, args });
};

/*
 * Returns the number of Moments in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getMomentCount = async (account) => {
	const name = "moments/get_collection_length";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};
