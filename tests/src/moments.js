import { mintFlow } from "flow-js-testing";
import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractWithErrorRaised,
	getElvnAdminAddress,
} from "./common";

/**
 * Deploys NonFungibleToken and Moments contracts to ElvnAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const deployMoments = async () => {
	const ElvnAdmin = await getElvnAdminAddress();
	await mintFlow(ElvnAdmin, "10.0");

	await deployContractWithErrorRaised({ to: ElvnAdmin, name: "NonFungibleToken" });

	const addressMap = { NonFungibleToken: ElvnAdmin };
	return deployContractWithErrorRaised({ to: ElvnAdmin, name: "Moments", addressMap });
};

/**
 * Setups Moments collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const setupMomentsOnAccount = async (account) => {
	const name = "moments/setup_account";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

/**
 * Returns Moments supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 */
export const getMomentSupply = async () => {
	const name = "moments/get_moments_supply";

	return executeScriptWithErrorRaised({ name });
};

/**
 * Mints Moment of a specific **itemType** and sends it to **recipient**.
 * @param {UInt64} itemType - type of NFT to mint
 * @param {string} recipient - recipient account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 */
export const mintMoment = async (
	recipient,
	metadata = {
		sportEvent: "soccer",
		playerId: "1",
		season: "2020",
		position: "goalkeeper",
		gameId: "1",
		cardSituationTag: "save",
		cardTierId: "1",
		cardSerialNumber: "1",
		cardBadgeId: "1",
	}
) => {
	const ElvnAdmin = await getElvnAdminAddress();

	const name = "moments/mint_moment";
	const args = [recipient, metadata];
	const signers = [ElvnAdmin];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/**
 * Transfers Moment NFT with id equal **itemId** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 */
export const transferMoment = async (sender, recipient, itemId) => {
	const name = "moments/transfer_moment";
	const args = [recipient, itemId];
	const signers = [sender];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/**
 * Returns the Moment NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 */
export const getMoment = async (account, itemID) => {
	const name = "moments/get_moment";
	const args = [account, itemID];

	return executeScriptWithErrorRaised({ name, args });
};

/**
 * Returns the number of Moments in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 */
export const getMomentCount = async (account) => {
	const name = "moments/get_collection_length";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};

export const getMomentIds = async (account) => {
	const name = "moments/get_collection_ids";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};
