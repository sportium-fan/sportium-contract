"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeeBalance = void 0;
exports.getFeeBalance = `import ElvnFeeTreasury from 0xElvnFeeTreasury

pub fun main(): UFix64 {
    return ElvnFeeTreasury.getBalance()
}
`;
