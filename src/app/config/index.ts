import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  db_url: process.env.DB_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  dcrypt_salt_round: process.env.DCRYPT_SALT_ROUND,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  stripe_sk: process.env.STRIPE_SK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  nodemailer_auth_user: process.env.NODEMAILER_AUTH_USER,
  nodemailer_auth_pass: process.env.NODEMAILER_AUTH_PASS,
};
