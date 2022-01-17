import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { getElvnAdminAddress } from "../src/common";
import {
	deployMoments,
	getMomentCount,
	getMomentSupply,
	mintMoment,
	setupMomentsOnAccount,
	transferMoment,
	types,
	rarities,
} from "../src/moments";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Moments", () => {
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

	it("shall deploy Moments contract", async () => {
		await shallPass(deployMoments());
	});

	it("supply shall be 0 after contract is deployed", async () => {
		// Setup
		await deployMoments();
		const ElvnAdmin = await getElvnAdminAddress();
		await shallPass(setupMomentsOnAccount(ElvnAdmin));

		await shallResolve(async () => {
			const supply = await getMomentSupply();
			expect(supply).toBe(0);
		});
	});

	it("shall be able to mint a moments", async () => {
		// Setup
		await deployMoments();
		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintMoment(Alice, types.fishbowl, rarities.blue));
	});

	it("shall be able to create a new empty NFT Collection", async () => {
		// Setup
		await deployMoments();
		const Alice = await getAccountAddress("Alice");
		await setupMomentsOnAccount(Alice);

		// shall be able te read Alice collection and ensure it's empty
		await shallResolve(async () => {
			const itemCount = await getMomentCount(Alice);
			expect(itemCount).toBe(0);
		});
	});

	it("shall not be able to withdraw an NFT that doesn't exist in a collection", async () => {
		// Setup
		await deployMoments();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupMomentsOnAccount(Alice);
		await setupMomentsOnAccount(Bob);

		// Transfer transaction shall fail for non-existent item
		await shallRevert(transferMoment(Alice, Bob, 1337));
	});

	it("shall be able to withdraw an NFT and deposit to another accounts collection", async () => {
		await deployMoments();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupMomentsOnAccount(Alice);
		await setupMomentsOnAccount(Bob);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintMoment(Alice, types.fishbowl, rarities.blue));

		// Transfer transaction shall pass
		await shallPass(transferMoment(Alice, Bob, 0));
	});
});
