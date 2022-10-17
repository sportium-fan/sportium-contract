"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackRemainingCount = void 0;
exports.getPackRemainingCount = `import Pack from 0xPack

pub fun main(releaseId: UInt64): Int {
	return Pack.getPackRemainingCount(releaseId: releaseId)
}
 `;
