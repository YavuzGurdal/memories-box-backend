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
    }
})

const Memory = mongoose.model('memo', memoSchema) // memo modelin adi db de bu ismi alacak, memoSchema modelin semasi (yani bu model ne yapacak) 
// mongoose un model metodu ile bunu db ye gonderiyoruz

export default Memory