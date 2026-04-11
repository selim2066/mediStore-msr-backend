
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT ||5000;


async function main() {
  try {
    await prisma.$connect();
    app.listen(config.port, () => {
      //console.log(`Example app listening on port {config.port}`);
      console.log("Server is running on http://localhost:" + PORT);
    });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
