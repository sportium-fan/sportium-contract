import { getAccountAddress, deployContract, executeScript, sendTransaction } from "flow-js-testing";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const UFIX64_PRECISION = 8;

// UFix64 values shall be always passed as strings
export const toUFix64 = (value) => value.toFixed(UFIX64_PRECISION);

export const getElvnAdminAddress = async () => getAccountAddress("ElvnAdmin");

const getContractCode = (path) => {
	return readFileSync(path, "utf8");
};

const blocto = readdirSync(join(__dirname, "../../contracts/blocto"), "utf8");
const sprt = readdirSync(join(__dirname, "../../contracts/sprt"), "utf8");
const std = readdirSync(join(__dirname, "../../contracts/std"), "utf8");
const getCategory = (name) => {
	const cadenceName = `${name}.cdc`;

	if (blocto.includes(cadenceName)) {
		return "blocto";
	}

	if (sprt.includes(cadenceName)) {
		return "sprt";
	}

	if (std.includes(cadenceName)) {
		return "std";
	}

	throw new Error(`Invalid Contract Name: ${name}`);
};

export const sendTransactionWithErrorRaised = async (...props) => {
	const [resp, err] = await sendTransaction(...props);
	if (err) {
		throw err;
	}
	return resp;
};

export const executeScriptWithErrorRaised = async (...props) => {
	const [resp, err] = await executeScript(...props);
	if (err) {
		throw err;
	}
	return resp;
};

export const deployContractWithErrorRaised = async (props) => {
	const { name } = props;
	const category = getCategory(name);
	const contractCode = getContractCode(join(__dirname, `../../contracts/${category}/${name}.cdc`));

	const [resp, err] = await deployContract({
		...props,
		code: contractCode,
	});
	if (err) {
		throw err;
	}
	return resp;
};
