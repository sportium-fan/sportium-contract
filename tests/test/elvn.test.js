import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { getElvnAdminAddress, toUFix64 } from "../src/common";
import { deployElvn, getElvnSupply, setupElvnOnAccount, getElvnBalance, mintElvn, transferElvn } from "../src/elvn";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Elvn", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
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

	it("shall deploy Elvn contract", async () => {
		await shallPass(deployElvn());
	});

	it("shall be able setup account", async () => {
		await deployElvn();

		const Alice = await getAccountAddress("Alice");
		await shallResolve(setupElvnOnAccount(Alice));
	});

	it("shall have initialized supply field correctly", async () => {
		// Deploy contract
		await shallPass(deployElvn());

		await shallResolve(async () => {
			const supply = await getElvnSupply();
			expect(supply).toBe(toUFix64(0));
		});
	});

	it("shall be able to create empty Vault that doesn't affect supply", async () => {
		// Setup
		await deployElvn();
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupElvnOnAccount(Alice));

		await shallResolve(async () => {
			const supply = await getElvnSupply();
			const aliceBalance = await getElvnBalance(Alice);
			expect(supply).toBe(toUFix64(0));
			expect(aliceBalance).toBe(toUFix64(0));
		});
	});

	it("shall not be able to mint zero tokens", async () => {
		// Setup
		await deployElvn();
		const Alice = await getAccountAddress("Alice");
		await setupElvnOnAccount(Alice);

		// Mint instruction with amount equal to 0 shall be reverted
		await shallRevert(mintElvn(Alice, toUFix64(0)));
	});

	it("shall mint tokens, deposit, and update balance and total supply", async () => {
		// Setup
		await deployElvn();
		const Alice = await getAccountAddress("Alice");
		await setupElvnOnAccount(Alice);
		const amount = toUFix64(50);

		// Mint Elvn tokens for Alice
		await shallPass(mintElvn(Alice, amount));

		// Check Elvn total supply and Alice's balance
		await shallResolve(async () => {
			// Check Alice balance to equal amount
			const balance = await getElvnBalance(Alice);
			expect(balance).toBe(amount);

			// Check Elvn supply to equal amount
			const supply = await getElvnSupply();
			expect(supply).toBe(amount);
		});
	});

	it("shall not be able to withdraw more than the balance of the Vault", async () => {
		// Setup
		await deployElvn();
		const ElvnAdmin = await getElvnAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupElvnOnAccount(ElvnAdmin);
		await setupElvnOnAccount(Alice);

		// Set amounts
		const amount = toUFix64(1000);
		const overflowAmount = toUFix64(30000);

		// Mint instruction shall resolve
		await shallResolve(mintElvn(ElvnAdmin, amount));

		// Transaction shall revert
		await shallRevert(transferElvn(ElvnAdmin, Alice, overflowAmount));

		// Balances shall be intact
		await shallResolve(async () => {
			const aliceBalance = await getElvnBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(0));

			const ElvnAdminBalance = await getElvnBalance(ElvnAdmin);
			expect(ElvnAdminBalance).toBe(amount);
		});
	});

	it("shall be able to withdraw and deposit tokens from a Vault", async () => {
		await deployElvn();
		const ElvnAdmin = await getElvnAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupElvnOnAccount(ElvnAdmin);
		await setupElvnOnAccount(Alice);
		await mintElvn(ElvnAdmin, toUFix64(1000));

		await shallPass(transferElvn(ElvnAdmin, Alice, toUFix64(300)));

		await shallResolve(async () => {
			// Balances shall be updated
			const ElvnAdminBalance = await getElvnBalance(ElvnAdmin);
			expect(ElvnAdminBalance).toBe(toUFix64(700));

			const aliceBalance = await getElvnBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(300));

			const supply = await getElvnSupply();
			expect(supply).toBe(toUFix64(1000));
		});
	});
});
