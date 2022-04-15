import express from 'express'; // db icin bu paketi kullaniyorum
import mongoose from 'mongoose'; // db ile yani mongodb ile baglanti kurmak icin
import cors from 'cors';
import dotenv from 'dotenv'; // hassas bilgileri burada tutuyoruz


dotenv.config() // .dotenv icindeki anahtarlari bu sekilde kullanabiliyoruz

const app = express() // server i bu sekilde olusturuyoruz. suan bir express server olusturduk.

app.get('/', (req, res) => {
    res.json({ message: '8080. porta yapilan get istegi' })
})

app.listen(process.env.PORT, () => { // hangi porttan islem yapilacagini burda yaziyoruz. ayrica bir callback fonksiyon aliyor
    mongoose.connect(process.env.MONGO_URI, { // burdan db ye baglaniyorum
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useFindAndModify: true,
    })
        .then(() => console.log('db connected'))
        .catch((err) => console.log(err))
})