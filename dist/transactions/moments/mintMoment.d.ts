export declare const mintMoment = "import NonFungibleToken from 0xNonFungibleToken\n\nimport Moments from 0xMoments\n\ntransaction(recipient: Address, metadata: {String: String}) {\n\n    // local variable for storing the minter reference\n    let minter: &Moments.NFTMinter\n\n    prepare(signer: AuthAccount) {\n\n        // borrow a reference to the NFTMinter resource in storage\n        self.minter = signer.borrow<&Moments.NFTMinter>(from: Moments.MinterStoragePath)\n            ?? panic(\"Could not borrow a reference to the NFT minter\")\n    }\n\n    execute {\n        // get the public account object for the recipient\n        let recipient = getAccount(recipient)\n\n        // borrow the recipient's public NFT collection reference\n        let receiver = recipient\n            .getCapability(Moments.CollectionPublicPath)!\n            .borrow<&{NonFungibleToken.CollectionPublic}>()\n            ?? panic(\"Could not get receiver reference to the NFT Collection\")\n\n        // mint the NFT and deposit it to the recipient's collection\n        self.minter.mintNFT(recipient: receiver, metadata: metadata)\n    }\n}\n ";
