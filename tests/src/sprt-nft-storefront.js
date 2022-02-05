import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractByNameWithErrorRaised,
} from "./common";
import { getElvnAdminAddress } from "./common";
import { setupElvnOnAccount } from "./elvn";
import { setupFUSDOnAccount } from "./fusd";
import { deployMoments, setupMomentsOnAccount } from "./moments";
import { deployTreasury } from "./treasury";

/**
 * Deploys Moments and NFTStorefront contracts to ElvnAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const deployNFTStorefront = async () => {
	const ElvnAdmin = await getElvnAdminAddress();

	await deployMoments();
	await deployTreasury();

	const addressMap = {
		NonFungibleToken: ElvnAdmin,
		Moments: ElvnAdmin,
		Elvn: ElvnAdmin,
		FUSD: ElvnAdmin,
		ElvnFUSDTreasury: ElvnAdmin,
		ElvnFeeTreasury: ElvnAdmin,
	};

	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "SprtNFTStorefront", addressMap });
};

/**
 * Sets up NFTStorefront.Storefront on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const setupStorefrontOnAccount = async (account) => {
	// Account shall be able to Elvn
	await setupElvnOnAccount(account);
	// Account shall be able to FUSD
	await setupFUSDOnAccount(account);
	// Account shall be able to store Moments
	await setupMomentsOnAccount(account);

	const name = "sprtNftStorefront/setup_account";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

/**
 * Lists item with id equal to **item** id for sale with specified **price**.
 * @param {string} seller - seller account address
 * @param {UInt64} itemId - id of item to sell
 * @param {UFix64} price - price
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const createItemListing = async (seller, itemId, price) => {
	const name = "sprtNftStorefront/create_listing";
	const args = [itemId, price];
	const signers = [seller];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/**
 * Buys item with id equal to **item** id for **price** from **seller**.
 * @param {string} buyer - buyer account address
 * @param {UInt64} resourceId - resource uuid of item to sell
 * @param {string} seller - seller account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const purchaseItemListing = async (buyer, resourceId, seller) => {
	const name = "sprtNftStorefront/purchase_listing";
	const args = [resourceId, seller];
	const signers = [buyer];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

export const purchaseItemListingPaymentByFUSD = async (buyer, resourceId, seller) => {
	const name = "sprtNftStorefront/purchase_listing_payment_by_fusd";
	const args = [resourceId, seller];
	const signers = [buyer];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/**
 * Removes item with id equal to **item** from sale.
 * @param {string} owner - owner address
 * @param {UInt64} itemId - id of item to remove
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 */
export const removeItemListing = async (owner, itemId) => {
	const name = "sprtNftStorefront/remove_listing";
	const signers = [owner];
	const args = [itemId];

	return sendTransactionWithErrorRaised({ name, args, signers });
};

/**
 * Returns the number of items for sale in a given account's storefront.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 */
export const getListingCount = async (account) => {
	const name = "sprtNftStorefront/get_listings_length";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};
