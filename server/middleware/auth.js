import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1] // axios icindeki index.js'den bunu header icinde gonderdim. burda yakaliyorum

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET, // verify ile tokenlarin ayni olup olmadigini kontrol ediyorum.
            (err, decodedAccessToken) => {
                if (err) return res.status(403).json(err)
                req.creatorId = decodedAccessToken?.id // bu middleware ile her istege creatorId gonderiyorum (buda user'in id'si demek. decodedToken'den aldim)
                next() // hersey tamamsa islem devam ediyor
            }
        )
    } catch (error) {
        console.log(error)
    }
}

export default auth