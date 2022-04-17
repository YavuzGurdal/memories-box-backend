// memories url'ine gelen istekler bu router dan karsilanacak. yani burdaan islem gorecek
import express from 'express';

const router = express.Router() // express den geliyor

// GET ALL MEMORIES FROM DB
router.get('/', async (req, res) => { // '/' index,js de verdigimiz '/memories' i ifade ediyor
    res.json({ message: 'get all memories from database' })
})

// GET SINGLE MEMORY FROM DB
router.get('/:id', async (req, res) => {
    res.json({ message: ' get single memory from database' })
})

// CREAATE A MEMORY
router.post('/', async (req, res) => {
    res.json({ message: 'create a memory' })
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