// content of index.js
const http = require("http");
const fs = require("fs");
const port = 3000;

const handleIncomingPostRequest = async (urlPath, body) => {
  console.log("body", JSON.stringify(body, null, 2));
  return { success: true };
};

const server = http.createServer((request, response) => {
  console.log(request.url);

  switch (request.method.toUpperCase()) {
    case "POST":
      var reqBody = "";

      request.on("data", function (chunk) {
        reqBody += chunk;
      });

      request.on("end", async function () {
        const body = JSON.parse(reqBody);
        const data = await handleIncomingPostRequest(request.url, body);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(data));
        response.end();
        return;
      });
      return;
    case "GET":
      const html = fs.readFileSync("./index.html");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(html);
      response.end();
    default:
      break;
  }
});

server.listen(port, (err) => {
  if (err) {
    console.log("something bad happened", err);
    throw err;
  }
  console.log(`server is listening on ${port}`);
});
