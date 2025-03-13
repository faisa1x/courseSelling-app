// import dotenv from 'dotenv';
// const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
// export default 
// {
//   JWT_USER_PASSWORD
// };
import dotenv from 'dotenv';

dotenv.config();

export default {
  JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY
  // other configurations
};