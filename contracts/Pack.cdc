// SPDX-License-Identifier: Apache License 2.0
import FungibleToken from "./FungibleToken.cdc"

import Elvn from "./Elvn.cdc"
import Moments from "./Moments.cdc"

pub contract Pack {
    access(self) let vault: @Elvn.Vault

    access(self) let momentsListCandidate: @{UInt64: [[Moments.NFT]]}
    access(self) let salePacks: @{UInt64: [Pack.Token]}

    pub var totalSupply: UInt64
    
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    pub event CreatePackToken(packId: UInt64, releaseId: UInt64)
    pub event BuyPack(packId: UInt64, price: UFix64)
    pub event OpenPack(packId: UInt64, momentsIds: [UInt64], address: Address?)

    pub event Deposit(releaseId: UInt64, id: UInt64, to: Address?)
    pub event Withdraw(releaseId: UInt64, id: UInt64, from: Address?)
 
    pub resource Token {
        pub let id: UInt64

        pub let releaseId: UInt64
        pub let price: UFix64
        pub let momentsPerCount: UInt64

        pub fun openPacks(): @[Moments.NFT] {
            pre {
                Pack.getMomentsListRemainingCount(releaseId: self.releaseId) > 0: "Not enough moments in Pack Contract"
                UInt64(Pack.getMomentsLength(releaseId: self.releaseId)) == self.momentsPerCount: "Not equal momentsPerCount"
            }

            let momentsListLength = Pack.getMomentsListRemainingCount(releaseId: self.releaseId)
            let randomIndex = unsafeRandom() % UInt64(momentsListLength)

            let momentsListCandidate <- Pack.momentsListCandidate.remove(key: self.releaseId)!
            let momentsList <- momentsListCandidate.remove(at: randomIndex)
            
            Pack.momentsListCandidate[self.releaseId] <-! momentsListCandidate

            let momentsIds: [UInt64] = []
            while momentsIds.length < momentsList.length {
                let momentsRef = &momentsList[momentsIds.length] as? &Moments.NFT
                momentsIds.append(momentsRef.id)
            }
            emit OpenPack(packId: self.id, momentsIds: momentsIds, address: self.owner?.address)

            return <- momentsList
        }

        init(tokenId: UInt64, releaseId: UInt64, price: UFix64, momentsPerCount: UInt64) {
            self.id = tokenId
            self.releaseId = releaseId
            self.price = price
            self.momentsPerCount = momentsPerCount
        }
    }

    pub resource interface PackCollectionPublic {
        pub fun getIds(): [UInt64]
        pub fun getReleaseIds(): [UInt64]
        pub fun deposit(token: @Pack.Token)
    }
    
    pub resource Collection: PackCollectionPublic {
        // releaseId: [pack]
        pub var ownedPacks: @{UInt64: [Pack.Token]}

        pub fun getIds(): [UInt64] {
            let ids: [UInt64] = []

            for key in self.ownedPacks.keys {
                let ownedPack = &self.ownedPacks[key] as? &[Pack.Token]

                var i = 0;
                while i < ownedPack.length {
                    ids.append(ownedPack[i].id)
                    i = i + 1
                }
            }

            return ids
        }

        pub fun getReleaseIds(): [UInt64] {
            let releaseIds: [UInt64] = []

            for key in self.ownedPacks.keys {
                let ownedPack = &self.ownedPacks[key] as? &[Pack.Token]

                if ownedPack.length > 0 {
                    releaseIds.append(key)
                }
            }

            return releaseIds
        }

        pub fun withdrawReleaseId(releaseId: UInt64): @Pack.Token {
            let tokenList <- self.ownedPacks.remove(key: releaseId) ?? panic("missing Pack")

            if tokenList.length == 0 {
                self.ownedPacks[releaseId] <-! tokenList
                return panic("Not enough Pack releaseId: ".concat(releaseId.toString()))
            }

            let token <- tokenList.remove(at: 0)
            self.ownedPacks[releaseId] <-! tokenList

            emit Withdraw(releaseId: releaseId, id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun withdraw(id: UInt64): @Pack.Token {
            for key in self.ownedPacks.keys {
                let tokenList <- self.ownedPacks.remove(key: key) ?? panic("missing Pack")

                if tokenList.length > 0 {
                    var i = 0
                    while i < tokenList.length {
                        let token = &tokenList[i] as? &Pack.Token
                        if token.id == id {
                            let token <- tokenList.remove(at: i)
                            self.ownedPacks[id] <-! tokenList
                            emit Withdraw(releaseId: token.releaseId, id: token.id, from: self.owner?.address)
                            return <- token
                        }
                        i = i + 1
                    }
                    self.ownedPacks[id] <-! tokenList 
                } else {
                    destroy tokenList
                }
            }

            return panic("Not found id: ".concat(id.toString()))
        }

        pub fun deposit(token: @Pack.Token) {
            let id: UInt64 = token.id
            let releaseId = token.releaseId

            if self.ownedPacks[releaseId] == nil {
                self.ownedPacks[releaseId] <-! [<- token]
            } else {
                let packList <- self.ownedPacks.remove(key: releaseId)!
                packList.append(<- token)
                self.ownedPacks[releaseId] <-! packList
            }

            emit Deposit(releaseId: releaseId, id: id, to: self.owner?.address)
        }

        destroy() {
            destroy self.ownedPacks
        }

        init() {
            self.ownedPacks <- {}
        }
    }

    pub fun isPackExists(releaseId: UInt64): Bool {
        return self.salePacks[releaseId] != nil
    }

    pub fun getPackRemainingCount(releaseId: UInt64): Int {
        pre {
            self.isPackExists(releaseId: releaseId): "Not found releaseId: ".concat(releaseId.toString())
        }

        let packsRef = &self.salePacks[releaseId] as? &[Pack.Token]
        return packsRef.length
    }

    pub fun getMomentsListRemainingCount(releaseId: UInt64): Int {
        pre {
            self.isPackExists(releaseId: releaseId): "Not found releaseId: ".concat(releaseId.toString())
        }

        let momentsListCandidateRef = &self.momentsListCandidate[releaseId] as? &[[Moments.NFT]]
        return momentsListCandidateRef.length
    }

    pub fun getMomentsLength(releaseId: UInt64): Int {
        pre {
            self.getMomentsListRemainingCount(releaseId: releaseId) > 0: "Not enough moments in Pack Contract"
        }

        let momentsListCandidateRef = &self.momentsListCandidate[releaseId] as? &[[Moments.NFT]]
        let momentsListRef = &momentsListCandidateRef[0] as? &[Moments.NFT]

        return momentsListRef.length
    }

    pub fun getOnSaleReleaseIds(): [UInt64] {
        let releaseIds: [UInt64] = []
        for releaseId in self.momentsListCandidate.keys {
            let packsRef = &self.momentsListCandidate[releaseId] as? &[[Moments.NFT]]
            if packsRef.length > 0 {
                releaseIds.append(releaseId)
            }
        }

        return releaseIds 
    }

    pub fun getPackPrice(releaseId: UInt64): UFix64 {
        pre {
            self.getPackRemainingCount(releaseId: releaseId) > 0: "Sold out pack"
        }

        let packsRef = &self.salePacks[releaseId] as? &[Pack.Token]
        let packRef = &packsRef[0] as? &Pack.Token
        return packRef.price
    }

    pub fun buyPack(releaseId: UInt64, vault: @Elvn.Vault): @Pack.Token { 
        pre {
            self.getPackPrice(releaseId: releaseId) == vault.balance: "Not enough balance"
        }

        let balance = vault.balance
        self.vault.deposit(from: <- vault)

        let salePacks <- self.salePacks.remove(key: releaseId)!
        let pack <- salePacks.remove(at: 0)
        self.salePacks[releaseId] <-! salePacks

        emit BuyPack(packId: pack.id, price: pack.price)
        return <- pack
    }

    pub resource Administrator {
        pub fun addItem(pack: @Pack.Token, momentsList: @[Moments.NFT]) {
            pre {
                pack.momentsPerCount == UInt64(momentsList.length): "Not equal momentsPerCount"
            }
            let releaseId = pack.releaseId

            if Pack.salePacks[releaseId] == nil {
                let packs: @[Pack.Token] <- [<- pack]
                Pack.salePacks[releaseId] <-! packs
            } else {
                let packs <- Pack.salePacks.remove(key: releaseId)!
                packs.append(<- pack)
                Pack.salePacks[releaseId] <-! packs
            }

            if Pack.momentsListCandidate[releaseId] == nil {
                let moments: @[[Moments.NFT]] <- [<- momentsList]
                Pack.momentsListCandidate[releaseId] <-! moments
            } else {
                let moments <- Pack.momentsListCandidate.remove(key: releaseId)!
                moments.append(<- momentsList)
                Pack.momentsListCandidate[releaseId] <-! moments
            }
        }

        pub fun createPackToken(releaseId: UInt64, price: UFix64, momentsPerCount: UInt64): @Pack.Token {
            let pack <- create Pack.Token(tokenId: Pack.totalSupply, releaseId, price, momentsPerCount)
            Pack.totalSupply = Pack.totalSupply + 1

            emit CreatePackToken(packId: pack.id, releaseId: releaseId)
            return <- pack
        }

        pub fun withdraw(amount: UFix64?): @FungibleToken.Vault {
            if let amount = amount {    
                return <- Pack.vault.withdraw(amount: amount)
            } else {
                let balance = Pack.vault.balance
                return <- Pack.vault.withdraw(amount: balance)
            }
        }
    }

    pub fun createEmptyCollection(): @Pack.Collection {
        return <- create Collection()
    }

    init() {
        self.CollectionStoragePath = /storage/sportiumPackCollection
        self.CollectionPublicPath = /public/sportiumPackCollection

        self.momentsListCandidate <- {}
        self.salePacks <- {}
        self.vault <- Elvn.createEmptyVault() as! @Elvn.Vault
        self.totalSupply = 0

        self.account.save(<- create Administrator(), to: /storage/sportiumPackAdministrator)
    }
}
 