import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import express from 'express'

import User from '../db/userModel.js' // sonuna js ekliyorum. package.json "type": "module" yazdigim icin. diger turlu hata veriyor
import TokenModel from '../db/tokenModel.js'

const router = express.Router()

// CREATE A USER
router.post('/signup', async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName } = req.body

        const userExist = await User.findOne({ email }) // email'in db'ye kayitli olup olmadigina bakiyorum

        if (userExist) {
            return res
                .status(400)
                .json({ message: 'There is a user with this email' })
        }

        if (password !== confirmPassword) { // sifrelerin ayni olup olmadigini burda kontrol ediyorum
            return res
                .status(400)
                .json({ message: 'Passwords do not match' })
        }

        const hashedPassword = await bcrypt.hash(password, 10) // 10 hash'in zorluk derecesi. 10'u artirirsak artiyor

        const user = await User.create({
            email,
            name: `${firstName} ${lastName}`,
            password: hashedPassword,
        })

        const accessToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.ACCESS_TOKEN_SECRET, //.dotenv index.js de cagirdigim icin burda kullanabilirim
            {
                expiresIn: '3m', //access token'in suresi
            }
        )

        const refreshToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
        )

        await TokenModel.create({
            userId: user._id,
            refreshToken: refreshToken,
        })

        res.status(200).json({ user, accessToken }) // en son bu degerleri donduruyorum
    } catch (error) {
        console.log(error)
    }
})

export default router