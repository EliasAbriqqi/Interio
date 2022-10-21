import { create, router as _router, defaults } from "json-server";
const server = create();
const router = _router("./database/products.json");

const middlewares = defaults();

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
