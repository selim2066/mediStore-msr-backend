import app from './app';
import config from './config';
const PORT = process.env.PORT;
async function main() {
  try {
    app.listen(config.port, () => {
      //console.log(`Example app listening on port {config.port}`);
      console.log("Server is running on http://localhost:" + PORT);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
