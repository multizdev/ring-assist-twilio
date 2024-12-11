import { Router, Request, Response } from 'express';

import Twilio from 'twilio';

/*import { createCallState, resetCallState } from '#app/state/callManager.js';
import { initialMessages } from '#app/utils/promptUtil.js';
import speechClient from '#app/services/speechService.js';
import { SPEECH_REQUEST } from '#app/config/config.mjs';
import { handleSpeechData } from '#app/controllers/callController.js';*/

const incomingRouter: Router = Router();

incomingRouter.get('/issue', (req: any, res: any) => {
  console.log("ISSUE", req.body);

  return res.json({
    test: JSON.stringify(req.body),
  });
});

incomingRouter.post('/answer-call',(req: Request, res: Response) => {
  const callId = req.body.CallSid;

  console.log("RECEIVED CALL ID", callId);

  try {
    const response = new Twilio.twiml.VoiceResponse();

    const callSpecificWsUri = `${process.env.WS_SERVER_URI}/${callId}`;

    console.log("WS-URI-COMPLETE", callSpecificWsUri);

    const connect = response.connect();

    connect.stream({
      url: callSpecificWsUri,
      /*statusCallbackMethod: 'POST',
      statusCallback: `${process.env.WS_SERVER_URI}/api/incoming/`*/
    })

    console.log('rsp', response.toString());

    /*const callState = createCallState(callId);

    callState.messages = [...initialMessages];
    callState.currentCall = response;*/

    /*callState.recognizeStream = speechClient
      .streamingRecognize(SPEECH_REQUEST)
      .on('error', (error) => {
        console.error('Error in Speech-to-Text:', error);
      })
      .on('data', (data: any) => handleSpeechData(callId, data))
      .on('end', () => {
        console.log('Recognize Stream Ended: ', callId);
        void resetCallState(callId)
      });*/

    response.say("I say this after websocket connection ends");

    // Respond with the TwiML (XML format)
    res.type('text/xml');
    res.send(response.toString());
  } catch (e) {
    if (e instanceof Error) {
      console.log('Problem', e.message);
    }

  }
});

export default incomingRouter;
