// content of index.js
const http = require("http");
const fs = require("fs");
const port = 8080;

const requestHandler = (request, response) => {
    console.log(request.url);
    const html = fs.readFileSync("./index.html");
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(html);
    response.end();
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
    if (err) {
        console.log("something bad happened", err);
        throw err;
    }

    console.log(`server is listening on ${port}`);
});
