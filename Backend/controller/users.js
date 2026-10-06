import bcrypt from "bcrypt"

import USER from '../models/users.js'
import jwt from "jsonwebtoken"
export const signup = async (req, res) => {
    try {
        const { name, password, email } = req.body;
       const hashPassword = await bcrypt.hash(password,10)

        const user = await USER.create({
            name,
            password:hashPassword,
            email
        });

        res.status(201).json({
            message: "signup successful !!",
            user
        });

    } catch (error) {
        console.log(error.message);

        res.status(400).json({
            error: error.message
        });
    }
};

export const login= async(req,res)=>{
 try {
 const {  password, email } = req.body;

        const user = await USER.findOne({
            email
        })
       if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
        error: "Invalid credentials"
    });
}
       const token = jwt.sign(
        {id:user.id, role:user.role,},
        process.env.JWT_SECRET
       )

        res.status(201).json({
            message: "login Successfull !!",
            token, user: {
    id: user.id,
    name: user.name,
    role: user.role
  }
        });

   
    
    
 } catch (error) {
    console.log(error.message);
    
     res.status(401).json({message: "Invalid password"})
    
 }
    

}
export const update = async (req, res) => {
  try {
    const {
      oldEmail,
      name,
      email,
      password
    } = req.body;

    // Sab fields required
    if (!oldEmail || !name || !email || !password) {
      return res.status(400).json({
        message: "Old email, name, email and password are required"
      });
    }

    // 1. Old email se user find karo
    const user = await USER.findOne({
      email: oldEmail
    });

    // 2. Old email match nahi hua
    if (!user) {
      return res.status(404).json({
        message: "Old email does not match"
      });
    }

    // 3. Password ko hash karo
    const hashPassword = await bcrypt.hash(password, 10);

    // 4. User ki values change karo
    user.name = name;
    user.email = email;
    user.password = hashPassword;

    // 5. Database mein save
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};
export const fetch = async (req, res) => {
  try {
    const users = await USER.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: error.message
    });
  }
};
export const deletes = async (req, res) => {
  try {
    const { oldEmail } = req.body;

    if (!oldEmail) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await USER.findOneAndDelete({
      email: oldEmail
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email"
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: error.message
    });
  }
};