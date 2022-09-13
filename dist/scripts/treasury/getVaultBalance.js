"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVaultBalance = void 0;
exports.getVaultBalance = `import ElvnFUSDTreasury from 0xElvnFUSDTreasury

pub fun main(): [UFix64] {
    return ElvnFUSDTreasury.getBalance()
}
 `;
