export const setupAccount = `import Pack from 0xsprt/Pack

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) == nil {
            let collection <- Pack.createEmptyCollection()
            
            signer.save(<-collection, to: Pack.CollectionStoragePath)
            signer.link<&Pack.Collection{Pack.PackCollectionPublic}>(Pack.CollectionPublicPath, target: Pack.CollectionStoragePath)
        }
    }
}
`;
