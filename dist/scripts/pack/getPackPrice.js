"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackPrice = void 0;
exports.getPackPrice = `import Pack from 0xPack

pub fun main(releaseId: UInt64): UFix64 {
	return Pack.getPackPrice(releaseId: releaseId)
}
`;
