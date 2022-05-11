export declare const batchMintToken = "import Pack from 0xPack\nimport Moments from 0xMoments\n\ntransaction(recipient: Address, releaseId: UInt64, packPrice: UFix64, momentsPerCount: UInt64, packLength: UInt64) {\n    let admin: &Pack.Administrator\n    let adminMomentsCollectionRef: &Moments.Collection\n\n    let recipientCollectionRef: &Pack.Collection{Pack.PackCollectionPublic}\n\n    prepare(account: AuthAccount) {\n        self.admin = account\n            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)\n            ?? panic(\"Signer is not the pack admin\")\n        \n        self.adminMomentsCollectionRef = account\n            .borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)\n            ?? panic(\"Could not borrow a reference to the owner's collection\")\n        \n        self.recipientCollectionRef = getAccount(recipient)\n            .getCapability(Pack.CollectionPublicPath)\n            .borrow<&Pack.Collection{Pack.PackCollectionPublic}>()\n            ?? panic(\"Unable to borrow receiver reference\")\n    }\n\n    execute {\n        var i = 0 as UInt64\n        while i < packLength {\n            let packToken <- self.admin\n                .createPackToken(\n                    releaseId: releaseId, \n                    price: packPrice, \n                    momentsPerCount: momentsPerCount\n            )\n            self.recipientCollectionRef.deposit(token: <- packToken)\n\n            i = i +1\n        }\n\n    }\n}\n";