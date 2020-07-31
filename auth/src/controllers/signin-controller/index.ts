import { Password } from './../../services/Password';
import { BadRequestError } from '@goodtickets/common';
import {Request, Response, NextFunction} from "express";
import { User } from '../../models/user-model';
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {

    const {email, password} = req.body;
    const user = await User.findOne({email});
  
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }
    
    const passwordMatch = await Password.compare(
      (user.password).toString(), 
      password
    );
  
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    
     // Generate Web token
     const userJWT = jwt.sign({
      id: user._id,
      email: user.email
    }, 
      process.env.JWT_KEY!
    );
    
    // Store it on session object
    req.session = { jwt: userJWT };

    res.status(200).send({
      message: "Success",
      user
    });

  } catch (error) {
    throw new BadRequestError(error.message);
  }
}