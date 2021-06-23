const app = require("../server");
const server = require("http").Server(app);

const port = 3000;

server.listen(port);
console.log(`Server is running on port ${port}`);
//console.log(`El servidor se esta corriendo en el puerto: ${port}`);
