import path from "path";
import { emulator, init, getAccountAddress, mintFlow } from "flow-js-testing";

import { getElvnAdminAddress, toUFix64 } from "../src/common";
import {
	addItem,
	buyPack,
	buyPackPaymentByFUSD,
	deployPack,
	getCollectionIds,
	getMomentsListRemainingCount,
	getPackPrice,
	getPackRemainingCount,
	getReleaseIds,
	mintToken,
	openPackId,
	openPackReleaseId,
	setupPackAccount,
	purchaseWithMoments,
	buyPackPaymentByFLOW,
} from "../src/pack";
import { getMomentIds, mintMoment, setupMomentsOnAccount } from "../src/moments";
import { getElvnBalance, mintElvn, setupElvnOnAccount } from "../src/elvn";
import { getFUSDBalance, mintFUSD, setupFUSDOnAccount } from "../src/fusd";
import { deployTreasury, depositElvn } from "../src/treasury";
import { teleportedUSDTSetupAccount, deployBloctoSwap, teleportedIn, addLiquidityAdmin } from "../src/blocto";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Pack", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		const port = 7002;
		await init(basePath, { port });
		await emulator.start(port, false);
		return await new Promise((r) => setTimeout(r, 1000));
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
		return await new Promise((r) => setTimeout(r, 1000));
	});

	it("shall deploy Pack contract", async () => {
		await deployPack();
	});

	it("shall be able setup account", async () => {
		await deployPack();

		const Alice = await getAccountAddress("Alice");
		await setupPackAccount(Alice);
	});

	it("shall be able mint pack token", async () => {
		await deployPack();
		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);

		const Alice = await getAccountAddress("Alice");
		await setupPackAccount(Alice);
		await setupMomentsOnAccount(Alice);

		const releaseId = 1;
		const packPrice = toUFix64(100);
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: Alice,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const packIds = await getCollectionIds(Alice);
		expect(packIds).toEqual([packId]);
	});

	it("shall be able add pack, moments", async () => {
		await deployPack();
		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);

		const releaseId = 1;
		const packPrice = toUFix64(100);
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: ElvnAdmin,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const momentsId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await addItem(releaseId, [momentsId]);

		const packRemainingCount = await getPackRemainingCount(releaseId);
		expect(packRemainingCount).toEqual(1);

		const momentsListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(momentsListRemainingCount).toEqual(1);

		const price = await getPackPrice(releaseId);
		expect(price).toEqual(packPrice);
	});

	it("purchase with moments", async () => {
		await deployPack();
		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);

		const releaseId = 1;
		const packPrice = 100;

		const momentId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await purchaseWithMoments(releaseId, packPrice, [[momentId]]);

		const packRemainingCount = await getPackRemainingCount(releaseId);
		expect(packRemainingCount).toEqual(1);

		const momentsListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(momentsListRemainingCount).toEqual(1);

		const price = await getPackPrice(releaseId);
		expect(price).toEqual(toUFix64(packPrice));
	});

	it("shall be able buy pack token", async () => {
		await deployPack();
		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);

		const releaseId = 1;
		const packPrice = toUFix64(100);
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: ElvnAdmin,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const momentId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await addItem(releaseId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await mintElvn(Alice, toUFix64(100));
		let balance = await getElvnBalance(Alice);
		expect(balance).toEqual(toUFix64(100));

		await buyPack(Alice, releaseId);
		balance = await getElvnBalance(Alice);
		expect(balance).toEqual(toUFix64(0));

		const releaseIds = await getReleaseIds(Alice);
		expect(releaseIds).toEqual([releaseId]);
		const packIds = await getCollectionIds(Alice);
		expect(packIds).toEqual([packId]);

		const resultPackRemainingCount = await getPackRemainingCount(releaseId);
		expect(resultPackRemainingCount).toEqual(0);

		const resultMomentListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(resultMomentListRemainingCount).toEqual(1);
	});

	it("shall be able buy pack token, payment by FUSD", async () => {
		await deployPack();
		await deployTreasury();

		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);

		await mintElvn(ElvnAdmin, toUFix64(100));
		await depositElvn(ElvnAdmin, toUFix64(100));

		const releaseId = 1;
		const packPrice = toUFix64(100);
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: ElvnAdmin,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const momentId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await addItem(releaseId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await setupFUSDOnAccount(Alice);
		await mintFUSD(Alice, toUFix64(100));
		let balance = await getFUSDBalance(Alice);
		expect(balance).toEqual(toUFix64(100));

		await buyPackPaymentByFUSD(Alice, releaseId);
		balance = await getFUSDBalance(Alice);
		expect(balance).toEqual(toUFix64(0));
		const releaseIds = await getReleaseIds(Alice);
		expect(releaseIds).toEqual([releaseId]);
		const packIds = await getCollectionIds(Alice);
		expect(packIds).toEqual([packId]);

		const resultPackRemainingCount = await getPackRemainingCount(releaseId);
		expect(resultPackRemainingCount).toEqual(0);

		const resultMomentListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(resultMomentListRemainingCount).toEqual(1);
	});

	it("shall be able buy pack token, payment by FLOW", async () => {
		await deployPack();
		await deployTreasury();
		await deployBloctoSwap();

		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);
		await setupFUSDOnAccount(ElvnAdmin);

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

		const releaseId = 1;
		const packPrice = toUFix64(1);
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: ElvnAdmin,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const momentId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await addItem(releaseId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await setupFUSDOnAccount(Alice);
		await mintFlow(Alice, toUFix64(10000));

		await buyPackPaymentByFLOW(Alice, releaseId);

		const resultPackRemainingCount = await getPackRemainingCount(releaseId);
		expect(resultPackRemainingCount).toEqual(0);

		const resultMomentListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(resultMomentListRemainingCount).toEqual(1);

		expect(await getElvnBalance(Alice)).toEqual(toUFix64(0));
	});

	it("shall be able open pack release id", async () => {
		await deployPack();
		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);

		const releaseId = 1;
		const packPrice = 100;
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: ElvnAdmin,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const momentId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await addItem(releaseId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await mintElvn(Alice, 100);
		await buyPack(Alice, releaseId);

		await openPackReleaseId(Alice, releaseId);
		const releaseIds = await getReleaseIds(Alice);
		expect(releaseIds).toEqual([]);
		const packIds = await getCollectionIds(Alice);
		expect(packIds).toEqual([]);
		const momentIds = await getMomentIds(Alice);
		expect(momentIds).toEqual([0]);

		const resultPackRemainingCount = await getPackRemainingCount(releaseId);
		expect(resultPackRemainingCount).toEqual(0);

		const resultMomentListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(resultMomentListRemainingCount).toEqual(0);
	});

	it("shall be able open pack id", async () => {
		await deployPack();
		const ElvnAdmin = await getElvnAdminAddress();
		await setupMomentsOnAccount(ElvnAdmin);
		await setupPackAccount(ElvnAdmin);

		const releaseId = 1;
		const packPrice = 100;
		const momentsPerCount = 1;

		const packId = await mintPackToken({
			packRecipient: ElvnAdmin,
			packAddress: ElvnAdmin,
			releaseId,
			packPrice,
			momentsPerCount,
		});
		const momentId = await mintMomentToken({
			momentRecipient: ElvnAdmin,
			momentAddress: ElvnAdmin,
		});

		await addItem(releaseId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await mintElvn(Alice, 100);
		await buyPack(Alice, releaseId);

		await openPackId(Alice, packId);
		const releaseIds = await getReleaseIds(Alice);
		expect(releaseIds).toEqual([]);
		const packIds = await getCollectionIds(Alice);
		expect(packIds).toEqual([]);
		const momentIds = await getMomentIds(Alice);
		expect(momentIds).toEqual([0]);

		const resultPackRemainingCount = await getPackRemainingCount(releaseId);
		expect(resultPackRemainingCount).toEqual(0);

		const resultMomentListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(resultMomentListRemainingCount).toEqual(0);
	});
});

const mintMomentToken = async ({ momentRecipient, momentAddress }) => {
	return mintMoment(momentRecipient)
		.then((res) => res.events.find(({ type }) => type === `A.${momentAddress.replace("0x", "")}.Moments.Minted`))
		.then((event) => event.data.id);
};

const mintPackToken = async ({ packRecipient, packAddress, releaseId, packPrice, momentsPerCount }) => {
	return mintToken(packRecipient, {
		releaseId,
		packPrice,
		momentsPerCount,
	})
		.then((res) => res.events.find(({ type }) => type === `A.${packAddress.replace("0x", "")}.Pack.CreatePackToken`))
		.then((event) => event.data.packId);
};
