import path from "path";

import { emulator, init, getAccountAddress, mintFlow } from "flow-js-testing";

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
	purchaseItemListingPaymentByFLOW,
} from "../src/sprt-nft-storefront";
import { getElvnBalance, mintElvn } from "../src/elvn";
import { getFUSDBalance, mintFUSD } from "../src/fusd";
import { depositElvn, getFeeVaultBalance } from "../src/treasury";
import {
	getTUSDTBalance,
	teleportedUSDTSetupAccount,
	deployBloctoSwap,
	addLiquidityAdmin,
	teleportedIn,
} from "../src/blocto";

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
		await deployNFTStorefront();
	});

	it("shall be able to create an empty Storefront", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");

		await setupStorefrontOnAccount(Alice);
	});

	it("shall be able to create a listing", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);

		// Mint Moment for Alice's account
		await mintMoment(Alice);

		const itemID = 0;

		await createItemListing(Alice, itemID, toUFix64(1.11));
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

		await mintElvn(Bob, toUFix64(100));

		// Bob shall be able to buy from Alice
		const createItemListingTransactionResult = await createItemListing(Alice, itemId, toUFix64(1.11));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		await purchaseItemListing(Bob, listingResourceID, Alice);
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

		await mintFUSD(Bob, toUFix64(100));

		const createItemListingTransactionResult = await createItemListing(Alice, itemId, toUFix64(1.11));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		await purchaseItemListingPaymentByFUSD(Bob, listingResourceID, Alice);
		const feeAmount = 0.10545;
		await checkBalance(getFeeVaultBalance(), feeAmount);

		const itemCount = await getMomentCount(Bob);
		expect(itemCount).toBe(1);
		await checkBalance(getFUSDBalance(Bob), 98.89);

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
		await checkBalance(getElvnBalance(Alice), 1.11 - feeAmount);
	});

	it("shall be able to accept a listing, payment by FLOW", async () => {
		await deployNFTStorefront();
		await deployBloctoSwap();

		const ElvnAdmin = await getElvnAdminAddress();
		await setupStorefrontOnAccount(ElvnAdmin);

		// deposit elvn/fusd
		await mintElvn(ElvnAdmin, toUFix64(100));
		await depositElvn(ElvnAdmin, toUFix64(100));

		// add liquidity
		await mintFUSD(ElvnAdmin, toUFix64(10_000));
		await mintFlow(ElvnAdmin, toUFix64(10_000));
		await teleportedUSDTSetupAccount(ElvnAdmin);
		await teleportedIn(
			toUFix64(30_000),
			ElvnAdmin,
			"ECBE27765214c2B160fc46Cc9056A2e67D2AD37d",
			"ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
		);
		await addLiquidityAdmin(ElvnAdmin, "FlowUsdtSwapPair", toUFix64(10_000), toUFix64(10_000));
		await addLiquidityAdmin(ElvnAdmin, "FusdUsdtSwapPair", toUFix64(10_000), toUFix64(10_000));

		// seller
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintMoment(Alice);

		const itemId = 0;

		// buyer
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);
		await mintFlow(Bob, toUFix64(100));

		const createItemListingTransactionResult = await createItemListing(Alice, itemId, toUFix64(1));
		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		await purchaseItemListingPaymentByFLOW(Bob, listingResourceID, Alice);
		await checkBalance(getElvnBalance(Bob), 0);
	});

	it("shall be able to remove a listing", async () => {
		// Deploy contracts
		await deployNFTStorefront();

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);

		// Mint instruction shall pass
		await mintMoment(Alice);

		const itemId = 0;

		await getMoment(Alice, itemId);

		// Listing item for sale shall pass
		const createItemListingTransactionResult = await createItemListing(Alice, itemId, toUFix64(1.11));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		// Alice shall be able to remove item from sale
		await removeItemListing(Alice, listingResourceID);

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
	});
});

const checkBalance = async (promise, amount) => {
	const balance = await promise;
	expect(balance).toBe(toUFix64(amount));
};
