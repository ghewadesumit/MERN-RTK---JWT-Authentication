const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles)
            return res
                .sendStatus(401)
                .json({ message: 'Your role is not valid' }) //unAuthorized;
        const rolesArray = [...allowedRoles]
        console.log(rolesArray)
        console.log(req.roles)
        const result = req.roles
            .map((role) => rolesArray.includes(role))
            .find((value) => value == true)
        if (!result) return res.sendStatus(401)
        next()
    }
}
