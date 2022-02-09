export const getFeeBalanceScript = `import ElvnFeeTreasury from 0xElvnFeeTreasury

pub fun main(): UFix64 {
    return ElvnFeeTreasury.getBalance()
}
`;
