import path from "path";

import { emulator, init, getAccountAddress, shallPass } from "flow-js-testing";

import { getElvnAdminAddress, toUFix64 } from "../src/common";
import { getMomentCount, mintMoment, getMoment } from "../src/moments";
import {
	deployNFTStorefront,
	purchaseItemListing,
	createItemListing,
	removeItemListing,
	setupStorefrontOnAccount,
	getListingCount,
	purchaseItemListingPaymentByFUSD,
} from "../src/sprt-nft-storefront";
import { getElvnBalance, mintElvn } from "../src/elvn";
import { getFUSDBalance, mintFUSD } from "../src/fusd";
import { depositElvn, getFeeVaultBalance } from "../src/treasury";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("NFT Storefront", () => {
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		const port = 7003;
		await init(basePath, { port });
		await emulator.start(port, false);
		return await new Promise((r) => setTimeout(r, 1000));
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
		return await new Promise((r) => setTimeout(r, 1000));
	});

	it("shall deploy NFTStorefront contract", async () => {
		await shallPass(deployNFTStorefront());
	});

	it("shall be able to create an empty Storefront", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");

		await shallPass(setupStorefrontOnAccount(Alice));
	});

	it("shall be able to create a listing", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);

		// Mint Moment for Alice's account
		await shallPass(mintMoment(Alice));

		const itemID = 0;

		await shallPass(createItemListing(Alice, itemID, toUFix64(1.11)));
	});

	it("shall be able to accept a listing", async () => {
		// Setup
		await deployNFTStorefront();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintMoment(Alice);

		const itemId = 0;

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintElvn(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		const createItemListingTransactionResult = await shallPass(createItemListing(Alice, itemId, toUFix64(1.11)));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		await shallPass(purchaseItemListing(Bob, listingResourceID, Alice));
		const feeAmount = 0.10545;
		await checkBalance(getFeeVaultBalance(), feeAmount);

		const itemCount = await getMomentCount(Bob);
		expect(itemCount).toBe(1);
		await checkBalance(getElvnBalance(Bob), 98.89);

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
		await checkBalance(getElvnBalance(Alice), 1.11 - feeAmount);
	});

	it("shall be able to accept a listing, payment by FUSD", async () => {
		await deployNFTStorefront();

		const ElvnAdmin = await getElvnAdminAddress();
		await setupStorefrontOnAccount(ElvnAdmin);
		await mintElvn(ElvnAdmin, toUFix64(100));
		await depositElvn(ElvnAdmin, toUFix64(100));

		// seller
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintMoment(Alice);

		const itemId = 0;

		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintFUSD(Bob, toUFix64(100)));

		const createItemListingTransactionResult = await shallPass(createItemListing(Alice, itemId, toUFix64(1.11)));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		await shallPass(purchaseItemListingPaymentByFUSD(Bob, listingResourceID, Alice));
		const feeAmount = 0.10545;
		await checkBalance(getFeeVaultBalance(), feeAmount);

		const itemCount = await getMomentCount(Bob);
		expect(itemCount).toBe(1);
		await checkBalance(getFUSDBalance(Bob), 98.89);

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
		await checkBalance(getElvnBalance(Alice), 1.11 - feeAmount);
	});

	it("shall be able to remove a listing", async () => {
		// Deploy contracts
		await shallPass(deployNFTStorefront());

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupStorefrontOnAccount(Alice));

		// Mint instruction shall pass
		await shallPass(mintMoment(Alice));

		const itemId = 0;

		await getMoment(Alice, itemId);

		// Listing item for sale shall pass
		const createItemListingTransactionResult = await shallPass(createItemListing(Alice, itemId, toUFix64(1.11)));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		// Alice shall be able to remove item from sale
		await shallPass(removeItemListing(Alice, listingResourceID));

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
	});
});

const checkBalance = async (promise, amount) => {
	const balance = await promise;
	expect(balance).toBe(toUFix64(amount));
};
