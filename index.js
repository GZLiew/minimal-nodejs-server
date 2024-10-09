// content of index.js
const http = require("http");
const fs = require("fs");
const port = 3000;

const handlePostRequest = async (urlPath, body) => {
  console.log("{body,urlPath}", JSON.stringify({ body, urlPath }, null, 2));

  if (urlPath === "/v1/tse/device/000A8000FC0000001/tkorouter/thermostat") {
    return { success: true };
  }

  if (urlPath === "/auth/token" && "username" in body && "password" in body) {
    return {
      accessToken: "{access_token}",
      scope: "all",
      expiresIn: 86400,
      tokenType: "Bearer",
    };
  }

  if (urlPath === "/devices/abcd1234/commands" && "attribute" in body) {
    return { success: true };
  }

  return { success: true };
};

const handleGetRequest = (urlPath) => {
  if (urlPath === "/devices/abcd1234") {
    return {
      success: true,
      message: "",
      result: {
        name: "Bedroom ceiling light",
        id: "124",
        type: "DimmerSwitch",
        attributes: [
          {
            attribute: "status",
            value: true,
          },
          {
            attribute: "dimLevel",
            value: 100,
          },
        ],
      },
    };
  }

  if (urlPath === "/v1/tse/device/000A8000FC0000001/tkorouter/thermostat") {
    return {
      "fanspeed-allowed": ["low", "medium", "high", "auto"],
      "heat-setpoint-min": 18.88,
      temperature: 21.66,
      "fanspeed-state": "medium",
      "mode-state": "heat",
      "cool-setpoint": 22.22,
      "heat-setpoint": 22.22,
      "mode-allowed": ["cool", "off"],
      "cool-setpoint-min": 18.88,
      "heat-setpoint-max": 26.66,
      address: "000A8000FC000001",
      fanspeed: "medium",
      "cool-setpoint-max": 26.66,
      _link: {
        _self: "/v1/tse/device/000A8000FC000001/tkorouter/thermostat",
      },
      occupied: true,
      mode: "auto",
    };
  }
  return null;
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
        const data = await handlePostRequest(request.url, body);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(data));
        response.end();
        return;
      });
      return;
    case "GET":
      const data = handleGetRequest(request.url);
      const html = fs.readFileSync("./index.html");
      const responseData = data ? JSON.stringify(data) : html;
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(responseData);
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
