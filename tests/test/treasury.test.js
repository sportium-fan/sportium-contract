import path from "path";

import { emulator, init, getAccountAddress } from "flow-js-testing";

import { getElvnAdminAddress, toUFix64 } from "../src/common";
import {
	deployTreasury,
	depositElvn,
	depositFUSD,
	getVaultBalance,
	withdrawAllFUSD,
	withdrawFUSD,
	withdrawAllElvn,
	withdrawElvn,
	swapElvnToFUSD,
	swapFUSDToElvn,
} from "../src/treasury";
import { getFUSDBalance, mintFUSD, setupFUSDOnAccount } from "../src/fusd";
import { getElvnBalance, mintElvn, setupElvnOnAccount } from "../src/elvn";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("FUSD-Elvn Treasury", () => {
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

	it("shall deploy FUSD-Treasury contract", async () => {
		await deployTreasury();
	});

	it("get vault balance", async () => {
		await deployTreasury();

		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 0,
		});
	});

	it("deposit elvn", async () => {
		await deployTreasury();

		const Alice = await getAccountAddress("Alice");
		await setupElvnOnAccount(Alice);

		await mintElvn(Alice, toUFix64(10));
		await checkBalance(getElvnBalance(Alice), 10);

		await depositElvn(Alice, toUFix64(10));
		await checkBalance(getElvnBalance(Alice), 0);

		await checkVaultBalance({
			elvnAmount: 10,
			fusdAmount: 0,
		});
	});

	it("deposit fusd", async () => {
		await deployTreasury();

		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Alice);

		await mintFUSD(Alice, toUFix64(10));
		await checkBalance(getFUSDBalance(Alice), 10);

		await depositFUSD(Alice, toUFix64(10));
		await checkBalance(getFUSDBalance(Alice), 0);

		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 10,
		});
	});

	it("withdraw elvn", async () => {
		await deployTreasury();

		const Alice = await getAccountAddress("Alice");
		await setupElvnOnAccount(Alice);

		await mintElvn(Alice, toUFix64(10));
		await depositElvn(Alice, toUFix64(10));

		await checkBalance(getElvnBalance(Alice), 0);
		await checkVaultBalance({
			elvnAmount: 10,
			fusdAmount: 0,
		});

		await withdrawElvn(Alice, toUFix64(5));
		await checkBalance(getElvnBalance(Alice), 5);
		await checkVaultBalance({
			elvnAmount: 5,
			fusdAmount: 0,
		});

		await withdrawAllElvn(Alice);
		await checkBalance(getElvnBalance(Alice), 10);
		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 0,
		});
	});

	it("withdraw fusd", async () => {
		await deployTreasury();

		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Alice);

		await mintFUSD(Alice, toUFix64(10));
		await depositFUSD(Alice, toUFix64(10));

		await checkBalance(getFUSDBalance(Alice), 0);
		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 10,
		});

		await withdrawFUSD(Alice, toUFix64(5));
		await checkBalance(getFUSDBalance(Alice), 5);
		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 5,
		});

		await withdrawAllFUSD(Alice);
		await checkBalance(getFUSDBalance(Alice), 10);
		await checkVaultBalance({ elvnAmount: 0, fusdAmount: 0 });
	});

	it("swap fusd to elvn", async () => {
		const setupAccount = async (account) => {
			await setupFUSDOnAccount(account);
			await setupElvnOnAccount(account);
		};

		await deployTreasury();

		const ElvnAdmin = await getElvnAdminAddress();
		await setupAccount(ElvnAdmin);
		const Alice = await getAccountAddress("Alice");
		await setupAccount(Alice);

		await mintElvn(ElvnAdmin, toUFix64(10));
		await checkBalance(getElvnBalance(ElvnAdmin), 10);

		await depositElvn(ElvnAdmin, toUFix64(10));
		await checkVaultBalance({
			elvnAmount: 10,
			fusdAmount: 0,
		});

		await mintFUSD(Alice, toUFix64(10));
		await checkBalance(getFUSDBalance(Alice), 10);

		await swapFUSDToElvn(Alice, toUFix64(10));
		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 10,
		});

		await checkBalance(getElvnBalance(Alice), 10);
		await checkBalance(getFUSDBalance(Alice), 0);
	});

	it("swap elvn to fusd", async () => {
		const setupAccount = async (account) => {
			await setupFUSDOnAccount(account);
			await setupElvnOnAccount(account);
		};

		await deployTreasury();

		const ElvnAdmin = await getElvnAdminAddress();
		await setupAccount(ElvnAdmin);
		const Alice = await getAccountAddress("Alice");
		await setupAccount(Alice);

		await mintFUSD(ElvnAdmin, toUFix64(10));
		await checkBalance(getFUSDBalance(ElvnAdmin), 10);

		await depositFUSD(ElvnAdmin, toUFix64(10));
		await checkVaultBalance({
			elvnAmount: 0,
			fusdAmount: 10,
		});

		await mintElvn(Alice, toUFix64(10));
		await checkBalance(getElvnBalance(Alice), 10);

		await swapElvnToFUSD(Alice, toUFix64(10));
		await checkVaultBalance({
			elvnAmount: 10,
			fusdAmount: 0,
		});

		await checkBalance(getElvnBalance(Alice), 0);
		await checkBalance(getFUSDBalance(Alice), 10);
	});
});

const checkBalance = async (promise, amount) => {
	const balance = await promise;
	expect(balance).toBe(toUFix64(amount));
};

const checkVaultBalance = async ({ elvnAmount, fusdAmount }) => {
	const [elvnBalance, fusdBalance] = await getVaultBalance();
	expect(elvnBalance).toBe(toUFix64(elvnAmount));
	expect(fusdBalance).toBe(toUFix64(fusdAmount));
};
