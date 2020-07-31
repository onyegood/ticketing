import mongoose from 'mongoose';
import { Password } from "../../services/Password";

// An inerface that describes the properties 
// that are required to create new user
interface UserAttr {
  email: string;
  password: string;
}

// An interface that describes the properties
// the User model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttr): UserDocument;
}

// An interface that describes the properties
// that a User document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  } 
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashPass = await Password.toHash(this.get('password'));
    this.set('password', hashPass);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttr) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };