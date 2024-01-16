import express from "express";
import cors from "cors";
import router from "../routes/routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000, no http://localhost:3000");
});
