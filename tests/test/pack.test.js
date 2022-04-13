import path from "path";
import { emulator, init, getAccountAddress, shallPass } from "flow-js-testing";

import { getElvnAdminAddress } from "../src/common";
import {
	addItem,
	buyPack,
	deployPack,
	getCollectionIds,
	getMomentsListRemainingCount,
	getPackPrice,
	getPackRemainingCount,
	mintToken,
	openPack,
	setupPackAccount,
} from "../src/pack";
import { getMomentIds, mintMoment, setupMomentsOnAccount } from "../src/moments";
import { mintElvn, setupElvnOnAccount } from "../src/elvn";

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
		await shallPass(deployPack());
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
		const packPrice = 100;
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
		const packPrice = 100;
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

		await shallPass(addItem(packId, [momentsId]));

		const packRemainingCount = await getPackRemainingCount(releaseId);
		expect(packRemainingCount).toEqual(1);

		const momentsListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(momentsListRemainingCount).toEqual(1);

		const price = await getPackPrice(releaseId);
		expect(price).toEqual(packPrice.toFixed(8));
	});

	it("shall be able buy pack token", async () => {
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

		await addItem(packId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await mintElvn(Alice, 100);

		await buyPack(Alice, releaseId);
		const packIds = await getCollectionIds(Alice);
		expect(packIds).toEqual([packId]);

		const resultPackRemainingCount = await getPackRemainingCount(releaseId);
		expect(resultPackRemainingCount).toEqual(0);

		const resultMomentListRemainingCount = await getMomentsListRemainingCount(releaseId);
		expect(resultMomentListRemainingCount).toEqual(1);
	});

	it("shall be able open pack", async () => {
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

		await addItem(packId, [momentId]);

		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);
		await setupPackAccount(Alice);
		await setupElvnOnAccount(Alice);
		await mintElvn(Alice, 100);
		await buyPack(Alice, releaseId);

		await openPack(Alice, packId);
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
