
const uuid = require('uuid');
const fs = require('fs');
const util = require('util');
const {struct} = require('pb-util');
// Imports the Dialogflow library
const dialogflow = require('dialogflow');

// // Instantiates a session client
// const sessionClient = new dialogflow.SessionsClient();
//
// // The path to identify the agent that owns the created intent.
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);
//
// // Read the content of the audio file and send it as part of the request.
//
//
// // Recognizes the speech in the audio and detects its intent.
// const [response] = await sessionClient.detectIntent(request);
//
// console.log('Detected intent:');
// const result = response.queryResult;
// // Instantiates a context client


async function runSample(projectId = 'test1-lgbyty') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "Test1-f2143b36ee8b.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The audio file query request.
  const readFile = util.promisify(fs.readFile);
  const inputAudio = await readFile("sample.wav");
  const request = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding:'AUDIO_ENCODING_LINEAR_16',
        sampleRateHertz: "16000",
        languageCode: "en-US",
      },
    },
    inputAudio: inputAudio,
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

runSample()
