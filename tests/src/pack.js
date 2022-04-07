import { mintFlow } from "flow-js-testing";
import {
	sendTransactionWithErrorRaised,
	executeScriptWithErrorRaised,
	deployContractByNameWithErrorRaised,
	getElvnAdminAddress,
} from "./common";
import { deployElvn } from "./elvn";
import { deployMoments } from "./moments";

export const deployPack = async () => {
	const ElvnAdmin = await getElvnAdminAddress();
	await mintFlow(ElvnAdmin, "10.0");

	await deployMoments();
	await deployElvn();

	const addressMap = { Moments: ElvnAdmin, Elvn: ElvnAdmin };
	return deployContractByNameWithErrorRaised({ to: ElvnAdmin, name: "Pack", addressMap });
};

export const setupPackAccount = async (account) => {
	const name = "pack/setup_account";
	const signers = [account];

	return sendTransactionWithErrorRaised({ name, signers });
};

export const mintToken = async (
	recipient,
	{ releaseId, packPrice, momentTokenIds } = { releaseId: 1, packPrice: 1, momentTokenIds: [0] }
) => {
	const name = "pack/mint_token";
	const ElvnAdmin = await getElvnAdminAddress();
	const signers = [ElvnAdmin];
	const args = [recipient, releaseId, packPrice, momentTokenIds];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const addPack = async (packId) => {
	const name = "pack/add_pack";
	const ElvnAdmin = await getElvnAdminAddress();
	const signers = [ElvnAdmin];
	const args = [packId];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const buyPack = async (account, releaseId) => {
	const name = "pack/buy_pack";
	const signers = [account];
	const args = [releaseId];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const openPack = async (account, packId) => {
	const name = "pack/open_pack";
	const signers = [account];
	const args = [packId];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const getCollectionIds = async (address) => {
	const name = "pack/get_collection_ids";
	const args = [address];

	return executeScriptWithErrorRaised({ name, args });
};

export const getPackPrice = async (releaseId) => {
	const name = "pack/get_pack_price";
	const args = [releaseId];

	return executeScriptWithErrorRaised({ name, args });
};

export const getRemainingCount = async (releaseId) => {
	const name = "pack/get_remaining_count";
	const args = [releaseId];

	return executeScriptWithErrorRaised({ name, args });
};
