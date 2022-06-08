export declare const setupAccount = "import Pack from 0xsprt/Pack\n\ntransaction {\n    prepare(signer: AuthAccount) {\n        if signer.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) == nil {\n            let collection <- Pack.createEmptyCollection()\n            \n            signer.save(<-collection, to: Pack.CollectionStoragePath)\n            signer.link<&Pack.Collection{Pack.PackCollectionPublic}>(Pack.CollectionPublicPath, target: Pack.CollectionStoragePath)\n        }\n    }\n}\n";
