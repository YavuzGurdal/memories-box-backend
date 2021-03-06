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
            userId: user._id, // bu modeldeki userId'ye user'in id'sini atiyorum. bu sekilde hangi tokrn'in hangi user'a ait oldugunu bulabilecegim 
            refreshToken: refreshToken,
        })

        // COOKIE
        res.cookie('token', refreshToken, {
            httpOnly: true, // token bilgilerinin tarayicida gorunmesini engelliyor
            sameSite: 'strict', // 3.parti sitelerden yapilan isteklere cevap verilmeyecek. yani sadece cors'da belirttigimix originden gelen istekleri kabul edecek
        })

        res.status(200).json({ user, accessToken }) // en son bu degerleri donduruyorum
    } catch (error) {
        console.log(error)
    }
})

// LOGIN
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body // formdan gonderilen bilgileri yakaliyorum

        const user = await User.findOne({ email }) // find ile gelen email ile db de ayni email varsa bilgilerini aliyorum

        if (!user) return res.status(404).json({ message: 'User not found' })

        const isPasswordCorrect = await bcrypt.compare(password, user.password) // gelen password ile db'deki password'u karsilastiriyoruz

        if (!isPasswordCorrect) return res.status(404).json({ message: 'Check your login information and try again' })

        const accessToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.ACCESS_TOKEN_SECRET, //.dotenv index.js de cagirdigim icin burda kullanabilirim
            {
                expiresIn: '3m', //access token'in suresi.
            }
        )

        const refreshToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
        )

        await TokenModel.findOneAndUpdate(
            { userId: user._id },
            { refreshToken: refreshToken },
            { new: true }
        )

        // COOKIE
        res.cookie('token', refreshToken, {
            httpOnly: true, // token bilgilerinin tarayicida gorunmesini engelliyor
            sameSite: 'strict', // 3.parti sitelerden yapilan isteklere cevap verilmeyecek. yani sadece cors'da belirttigimix originden gelen istekleri kabul edecek
            secure: true // sadece https den gelen istekler alinacak
        })

        res.status(200).json({ user, accessToken })

    } catch (error) {
        res.status(500).json({ message: 'Something wrong' })
    }
})

// LOGOUT
router.get('/logout/:id', async (req, res) => {
    try {
        const { id } = req.params

        res.clearCookie('token') // cookie'yi siliyorum

        await TokenModel.findOneAndUpdate( // burasi onemli
            { userId: id }, // burda neye gore bulacagini yaziyoruz
            { refreshToken: null },
            { new: true }
        )

        res.status(200).json({ message: 'Successfully Logged Out' })
    } catch (error) {
        res.status(500).json(error)
    }
})

// REFRESHTOKEN
router.get('/refresh/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { refreshToken } = await TokenModel.findOne({ userId: id }) // userId'si id'ye esit olan kullanicinin refreshToken'ini almis oluyorum
        //console.log(refreshToken)
        if (!refreshToken) return res.sendStatus(401)

        // COOKIE
        const cookie = req.cookies.token
        if (!cookie) res.sendStatus(403)

        if (cookie !== refreshToken) res.sendStatus(401)

        //res.status(200).json({ refreshToken })
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, x) => { // bu sekilde dogrulama yapiyorum // (err,decodedRefreshToken) ilk parametre error ikinci parametre token cozulmus hali
            if (err) return res.status(403).json(err)
            //console.log(x.id)
            const accessToken = jwt.sign(
                { email: x.email, id: x.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3m' }
            )
            res.status(200).json(accessToken)
        })
    } catch (error) {
        console.log(error.message)
    }
})

export default router