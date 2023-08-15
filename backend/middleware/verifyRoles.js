const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401).json({ message: 'Your role is not valid' }); //unAuthorized;
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log('Roles from request are', req.roles, Object.values(req.roles));
        const requestRoles = Object.values(req.roles);
        const result = requestRoles?.map((role) => rolesArray.includes(role)).find((value) => value == true);
        if (!result) return res.sendStatus(401);
        next();
    };
};

module.exports = { verifyRoles };
