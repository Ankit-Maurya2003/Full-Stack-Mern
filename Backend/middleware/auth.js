import jwt from "jsonwebtoken"
const auth =  (req,res,next)=>{
  try { 
    const token = req.headers.authorization.split(" ")[1]
    const user = jwt.verify(token,process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({error: "invaild token"})
  }

}
export default auth