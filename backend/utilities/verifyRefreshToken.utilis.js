function verifyRefresh(email, token) {
    try {
     const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
     return decoded.email === email;
    } catch (error) {
     // console.error(error);
     return false;
    }
   }
   