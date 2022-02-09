export const getMomentsSupply = `import Moments from 0xMoments

// This scripts returns the number of Moments currently in existence.

pub fun main(): UInt64 {    
    return Moments.totalSupply
}
`;
