// memories url'ine gelen istekler bu router dan karsilanacak. yani buradan islem gorecek
import express from 'express';
import mongoose from 'mongoose';
import mongoosefrom from 'mongoose';

import Memory from '../db/memoryModel.js' // sonuna js ekliyorum. package.json "type": "module" yazdigim icin. diger turlu hata veriyor

const router = express.Router() // express den geliyor

// GET ALL MEMORIES FROM DB
router.get('/', async (req, res) => { // '/' index,js de verdigimiz '/memories' i ifade ediyor
    try {
        const memories = await Memory.find() // memories db den gelen degerleri tutacak. 
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

        const memory = await Memory.findById(id)
        if (!memory) return

        res.status(200).json(memory)
    } catch (error) {
        res.status(404).json({ message: 'Memory not found' })
    }
})

// CREATE A MEMORY
router.post('/', async (req, res) => {
    try {
        const memory = req.body // kullanicinin yaptigi req'in icinde body nin icinden bu bilgileri aldim

        const createdMemory = await Memory.create(memory) // create metodunu kullandim

        res.status(201).json(createdMemory)
    } catch (error) {
        res.json({ message: 'Create memory failed' })
    }
})

// UPDATE A MEMORY
router.put('/:id', async (req, res) => {
    res.json({ message: 'update a memory' })
})

// DELETE A MEMORY
router.delete('/:id', async (req, res) => {
    res.json({ message: 'delete a memory' })
})

export default router