import express from 'express'; // db icin bu paketi kullaniyorum
import mongoose from 'mongoose'; // db ile yani mongodb ile baglanti kurmak icin
import cors from 'cors';
import dotenv from 'dotenv'; // hassas bilgileri burada tutuyoruz

import memoryRouter from './routers/memoryRouter.js' // sonuna js ekliyorum. package.json "type": "module" yazdigim icin. diger turlu hata veriyor
import userRouter from './routers/userRouter.js' // sonuna js ekliyorum. package.json "type": "module" yazdigim icin. diger turlu hata veriyor
import cookieParser from 'cookie-parser';

dotenv.config() // .dotenv icindeki anahtarlari bu sekilde kullanabiliyoruz

const app = express() // server i bu sekilde olusturuyoruz. suan bir express server olusturduk.

app.use(express.json({ limit: '20mb' })) // ***** gelen json larin ayristirilmasini sagliyor. ayrica burda gelen data icin limit verebiliyoruz

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })) // backend de localhost tan gelen isteklere cevap verilmesini saglamak icin. yoksa problem oluyor
// credentials: true, origin: 'http://localhost:8080' bunlari cookieleri frontende gonderip islem yapabilmek icin yazdim

app.use(cookieParser()) // frontend'den gelen cookie'leri okumami sagliyor

app.use('/memories', memoryRouter) // 1.parametre dinleyecegimiz url. 2.parametre bu url'e gelecek istekleri kimin karsilayacagini belirtiyor
app.use('/users', userRouter) // 1.parametre dinleyecegimiz url. 2.parametre bu url'e gelecek istekleri kimin karsilayacagini belirtiyor

// app.get('/', (req, res) => {
//     res.json({ message: '8080. porta yapilan get istegi' })
// })

app.listen(process.env.PORT, () => { // hangi porttan islem yapilacagini burda yaziyoruz. ayrica bir callback fonksiyon aliyor
    mongoose.connect(process.env.MONGO_URI, { // burdan db ye baglaniyorum
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useFindAndModify: false,
    })
        .then(() => console.log('db connected'))
        .catch((err) => console.log(err))
})