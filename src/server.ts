import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import superAdmin from './app/DB';

async function main() {
  //   await mongoose.connect("mongodb://127.0.0.1:27017/test");
  try {
    await mongoose.connect(config.db_url as string);
    superAdmin();
    app.listen(config.port, () => {
      console.log(`Pet Care app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
