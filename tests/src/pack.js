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
	{ releaseId, packPrice, momentsPerCount } = { releaseId: 1, packPrice: 1, momentsPerCount: 1 }
) => {
	const name = "pack/mint_token";
	const ElvnAdmin = await getElvnAdminAddress();
	const signers = [ElvnAdmin];
	const args = [recipient, releaseId, packPrice, momentsPerCount];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const addItem = async (releaseId, momentsIds) => {
	const name = "pack/add_item";
	const ElvnAdmin = await getElvnAdminAddress();
	const signers = [ElvnAdmin];
	const args = [releaseId, momentsIds];

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

export const buyPackPaymentByFUSD = async (account, releaseId) => {
	const name = "pack/buy_pack_payment_by_fusd";
	const signers = [account];
	const args = [releaseId];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const openPackReleaseId = async (account, releaseId) => {
	const name = "pack/open_pack_release_id";
	const signers = [account];
	const args = [releaseId];

	return sendTransactionWithErrorRaised({
		name,
		signers,
		args,
	});
};

export const openPackId = async (account, packId) => {
	const name = "pack/open_pack_id";
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

export const getReleaseIds = async (address) => {
	const name = "pack/get_release_ids";
	const args = [address];

	return executeScriptWithErrorRaised({ name, args });
};

export const getPackPrice = async (releaseId) => {
	const name = "pack/get_pack_price";
	const args = [releaseId];

	return executeScriptWithErrorRaised({ name, args });
};

export const getPackRemainingCount = async (releaseId) => {
	const name = "pack/get_pack_remaining_count";
	const args = [releaseId];

	return executeScriptWithErrorRaised({ name, args });
};

export const getMomentsListRemainingCount = async (releaseId) => {
	const name = "pack/get_moments_list_remaining_count";
	const args = [releaseId];

	return executeScriptWithErrorRaised({ name, args });
};
