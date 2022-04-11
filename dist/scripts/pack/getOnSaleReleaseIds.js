"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnSaleReleaseIds = void 0;
exports.getOnSaleReleaseIds = `import Pack from 0xPack

pub fun main(): [UInt64] {
	return Pack.getOnSaleReleaseIds()
}
`;
