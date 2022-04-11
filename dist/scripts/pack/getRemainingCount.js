"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingCount = void 0;
exports.getRemainingCount = `import Pack from 0xPack

pub fun main(releaseId: UInt64): Int {
	return Pack.getPackRemainingCount(releaseId: releaseId)
}
`;
