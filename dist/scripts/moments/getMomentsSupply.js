"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMomentsSupply = void 0;
exports.getMomentsSupply = `import Moments from 0xMoments

// This scripts returns the number of Moments currently in existence.

pub fun main(): UInt64 {    
    return Moments.totalSupply
}
`;
