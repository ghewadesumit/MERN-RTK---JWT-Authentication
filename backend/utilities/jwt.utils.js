const verifyAccessToken = (token) => {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return {decoded,expired : false}
    }catch(error){
        return {decoded, expired: true}
    }
}

module.exports = {verifyAccessToken};