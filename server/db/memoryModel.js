// db'ye nasil kaydedilecegini burada belirliyorum

import mongoose from "mongoose";

const memoSchema = mongoose.Schema({ // icerik icin bu semayi olusturduk
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date() // kayit yapildigi andaki tarihi veriyor
    },
    creatorId: { // Authorization icin ekledim. burdaki id ile user id'yi kiyaslayacagim.
        type: String,
        required: true
    },
})

const Memory = mongoose.model('memo', memoSchema) // memo modelin adi db de bu isim ile kaydedilecek, memoSchema modelin semasi (yani bu model db de nasil olacak) 
// mongoose un model metodu ile bunu db ye gonderiyoruz

export default Memory