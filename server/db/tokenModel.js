import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
})

const TokenModel = mongoose.model('token', tokenSchema)

export default TokenModel

