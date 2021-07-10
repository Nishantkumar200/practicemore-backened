import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
 
  try {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    console.log(token)
    const isCustomAuth = token.lenght < 500;
    let decodedeData;

    if (token && isCustomAuth) {
      decodedeData = jwt.verify(token, "secret");
      console.log(decodedeData)

      req.userId = decodedeData?.id;
    } else {
      decodedeData = jwt.verify(token);
      req.userId = decodedeData?.sub;
    }
    // if this things are working properly then
    next();
  } catch (error) {
    console.log(error);
  }
};
