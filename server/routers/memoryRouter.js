// memories url'ine gelen istekler bu router dan karsilanacak. yani buradan islem gorecek
import express from 'express';
import mongoose from 'mongoose';

import auth from '../middleware/auth.js'

import Memory from '../db/memoryModel.js' // sonuna js ekliyorum. package.json "type": "module" yazdigim icin. diger turlu hata veriyor

const router = express.Router() // express den geliyor

// GET ALL MEMORIES FROM DB
router.get('/', async (req, res) => { // '/' index.js de verdigimiz '/memories' i ifade ediyor
    try {
        const memories = await Memory.find() // memories db den gelen degerleri tutacak. // mongoose metodu
        // Memory.find() seklinde yazdigimda butun memeriesleri getiriyor. bu islem icin Memory modelini kullaniyor.
        // await kullanmazsam memories bos olur. cunku db den bu bilgileri alirken cok azda olsa bir zaman geciyor.

        res.status(200).json(memories) // status 200 ve db den gelen memoriesi geri donduruyorum
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

// GET SINGLE MEMORY FROM DB
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params // bu sekilde id'yi direk alabiliyorum. kullanicin yaptigi request icinde bu bilgi mevcut olacak

        if (!mongoose.Types.ObjectId.isValid(id)) { // id mongodb id'si degilse demek
            res.status(404).json({ message: 'Memory id is not valid' })
        }

        const memory = await Memory.findById(id) // mongoose metodu
        if (!memory) {
            return res.status(404).json({ message: 'Memory not found' })
        }

        res.status(200).json(memory)
    } catch (error) {
        res.status(404).json({ message: 'Memory not found' })
    }
})

// CREATE A MEMORY
router.post('/', auth, async (req, res) => {
    try {
        const memory = req.body // kullanicinin yaptigi req'in icindeki body nin icinden bu bilgileri aldim

        const createdMemory = await Memory.create({ // create metodunu kullandim // mongoose metodu
            ...memory,
            creatorId: req.creatorId,
        })

        res.status(201).json(createdMemory)
    } catch (error) {
        res.json({ message: 'Memory create failed' })
    }
})

// UPDATE A MEMORY
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params // bu sekilde id'yi direk alabiliyorum. kullanicin yaptigi request icinde bu bilgi mevcut olacak

        if (!mongoose.Types.ObjectId.isValid(id)) { // id mongodb id'si degilse demek
            res.status(404).json({ message: 'Memory id is not valid' })
        }

        // Memory Authorization
        const oldMemory = await Memory.findById(id)
        if (req.creatorId !== oldMemory.creatorId) return res.sendStatus(403)

        const { title, content, creator, image } = req.body

        // const updatedMemory = await Memory.findOneAndUpdate(
        //     { _id: id },
        //     { title, content, creator, image }, // _id: id bunu yazmasakda oluyor. aslinda kendi ona gore guncelliyor
        //     { new: true } // update edilen datayi dondurmesi icin. burda update edilen memoryyi donduruyor
        // )

        const updatedMemory = await Memory.findByIdAndUpdate(
            id,
            { _id: id, title, content, creator, image }, // _id: id bunu yazmasakda oluyor. aslinda kendi ona gore guncelliyor
            { new: true } // update edilen datayi dondurmesi icin. burda update edilen memoryyi donduruyor
        )

        res.status(200).json(updatedMemory)
    } catch (error) {
        res.json({ message: 'Memory update failed' })
    }
})

// DELETE A MEMORY
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params // bu sekilde id'yi direk alabiliyorum. kullanicin yaptigi request icinde bu bilgi mevcut olacak

        if (!mongoose.Types.ObjectId.isValid(id)) { // id mongodb id'si degilse demek
            res.status(404).json({ message: 'Memory id is not valid' })
        }

        // Memory Authorization
        const oldMemory = await Memory.findById(id)
        if (req.creatorId !== oldMemory.creatorId) return res.sendStatus(403)

        await Memory.findOneAndDelete({ _id: id }) // burasi onemli. yoksa hata veriyor

        res.status(200).json({ message: 'Memory has been deleted' })
    } catch (error) {
        res.json({ message: 'Memory delete failed' })
    }
})

export default router