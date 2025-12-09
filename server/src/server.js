import app from "./app.js";
import config from "./configs/index.js";

const port = config.port;

app.listen(port, () => {
  console.log("server run on port ", port);
});
