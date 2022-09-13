export const getVaultBalance = `import ElvnFUSDTreasury from 0xElvnFUSDTreasury

pub fun main(): [UFix64] {
    return ElvnFUSDTreasury.getBalance()
}
 `;
