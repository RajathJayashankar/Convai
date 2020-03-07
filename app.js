const uuid = require("uuid");
const fs = require("fs");
const util = require("util");
const { struct } = require("pb-util");
// Imports the Dialogflow library
const dialogflow = require("dialogflow");
const express = require("express");
const http = require("http");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + ".wav"); //Appending .jpg
  }
});

const upload = multer({ storage: storage });
var type = upload.single("audio_data");

async function runSample(audio_file, projectId = "test1-lgbyty") {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "Test1-f2143b36ee8b.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The audio file query request.
  const readFile = util.promisify(fs.readFile);
  const inputAudio = await readFile(`public/uploads/${audio_file}`);
  const request = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding: "AUDIO_ENCODING_LINEAR_16",
        sampleRateHertz: "48000",
        languageCode: "en-US"
      }
    },
    inputAudio: inputAudio
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

const hostname = "localhost";
const port = 3005;

const app = express();

const server = http.createServer(app);

app.post("/", type, (req, res) => {
  console.log(req.file);
  runSample(req.file.filename);
});

server.listen(port, hostname, () => {
  console.log("Server is running");
});
