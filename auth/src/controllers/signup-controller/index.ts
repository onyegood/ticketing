import { BadRequestError } from '@goodtickets/common';
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { User } from '../../models/user-model';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

      const {email, password} = req.body;
      const userExist = await User.findOne({email});
  
      if(userExist){
        throw new BadRequestError("User with this email already exist!");
      }
      
      const user = User.build({email, password});

      await user.save();

      // Generate Web token
      const userJWT = jwt.sign({
        id: user._id,
        email: user.email
      }, 
        process.env.JWT_KEY!
      );
      
      // Store it on session object
      req.session = { jwt: userJWT };

      res.status(201).send({
        message: "Success",
        user
      });

    } catch (error) {
      throw new BadRequestError(error.message);
    }
}