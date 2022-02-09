export const getVaultBalanceScript = `import ElvnFUSDTreasury from 0xElvnFUSDTreasury

pub fun main(): [UFix64] {
    return ElvnFUSDTreasury.getBalance()
}
`;
