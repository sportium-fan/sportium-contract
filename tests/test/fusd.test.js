import path from "path";

import { emulator, init, getAccountAddress, shallPass } from "flow-js-testing";

import { getElvnAdminAddress, toUFix64 } from "../src/common";
import { deployFUSD, mintFUSD, transferFUSD, setupFUSDOnAccount, getFUSDBalance } from "../src/fusd";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("FUSD", () => {
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

	it("shall deploy FUSD contract", async () => {
		await shallPass(deployFUSD());
	});

	it("shall be able setup account", async () => {
		await deployFUSD();

		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Alice);
	});

	it("shall be able to create empty Vault that doesn't affect supply", async () => {
		// Setup
		await deployFUSD();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Alice);

		const aliceBalance = await getFUSDBalance(Alice);
		expect(aliceBalance).toBe(toUFix64(0));
	});

	it("shall not be able to mint zero tokens", async () => {
		// Setup
		await deployFUSD();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Alice);

		// Mint instruction with amount equal to 0 shall be reverted
		let error = null;
		await mintFUSD(Alice, toUFix64(0)).catch((err) => (error = err));
		expect(error).not.toEqual(null);
	});

	it("shall mint tokens, deposit, and update balance and total supply", async () => {
		// Setup
		await deployFUSD();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Alice);
		const amount = toUFix64(50);

		// Mint Elvn tokens for Alice
		await shallPass(mintFUSD(Alice, amount));

		// Check Elvn total supply and Alice's balance
		// Check Alice balance to equal amount
		const balance = await getFUSDBalance(Alice);
		expect(balance).toBe(amount);
	});

	it("shall not be able to withdraw more than the balance of the Vault", async () => {
		// Setup
		await deployFUSD();
		const ElvnAdmin = await getElvnAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(ElvnAdmin);
		await setupFUSDOnAccount(Alice);

		// Set amounts
		const amount = toUFix64(1000);
		const overflowAmount = toUFix64(30000);

		// Mint instruction shall resolve
		await mintFUSD(ElvnAdmin, amount);

		// Transaction shall revert
		let error = null;
		await transferFUSD(ElvnAdmin, Alice, overflowAmount).catch((err) => (error = err));
		expect(error).not.toEqual(null);

		// Balances shall be intact
		const aliceBalance = await getFUSDBalance(Alice);
		expect(aliceBalance).toBe(toUFix64(0));

		const ElvnAdminBalance = await getFUSDBalance(ElvnAdmin);
		expect(ElvnAdminBalance).toBe(amount);
	});

	it("shall be able to withdraw and deposit tokens from a Vault", async () => {
		await deployFUSD();
		const ElvnAdmin = await getElvnAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(ElvnAdmin);
		await setupFUSDOnAccount(Alice);
		await mintFUSD(ElvnAdmin, toUFix64(1000));

		await shallPass(transferFUSD(ElvnAdmin, Alice, toUFix64(300)));

		// Balances shall be updated
		const ElvnAdminBalance = await getFUSDBalance(ElvnAdmin);
		expect(ElvnAdminBalance).toBe(toUFix64(700));

		const aliceBalance = await getFUSDBalance(Alice);
		expect(aliceBalance).toBe(toUFix64(300));
	});
});
