import {
	executeScriptWithErrorRaised,
	sendTransactionWithErrorRaised,
	deployContractWithErrorRaised,
	getElvnAdminAddress,
} from "./common";

export const deployBloctoSwap = async () => {
	const ElvnAdmin = await getElvnAdminAddress();

	await deployContractWithErrorRaised({ to: ElvnAdmin, name: "TeleportedTetherToken" });
	await deployContractWithErrorRaised({ to: ElvnAdmin, name: "FUSD" }).catch(() => {});

	const addressMap = {
		TeleportedTetherToken: ElvnAdmin,
		FUSD: ElvnAdmin,
	};
	await deployContractWithErrorRaised({ to: ElvnAdmin, name: "FusdUsdtSwapPair", addressMap });

	return deployContractWithErrorRaised({ to: ElvnAdmin, name: "FlowSwapPair", addressMap });
};

export const teleportedUSDTSetupAccount = async (account) => {
	const name = "blocto/teleport/setupAccount";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

export const teleportedIn = async (amount, target, from, hash) => {
	const name = "blocto/teleport/in";
	const args = [amount, target, from, hash];
	const signers = [await getElvnAdminAddress()];

	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const addLiquidityAdmin = async (account, exchange, token1Amount, token2Amount) => {
	const name = `blocto/exchange/${exchange}/addLiquidityAdmin`;
	const args = [token1Amount, token2Amount];
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers, args });
};

export const getTUSDTBalance = async (account) => {
	const name = "blocto/get_tusdt_balance";
	const args = [account];

	return executeScriptWithErrorRaised({ name, args });
};
