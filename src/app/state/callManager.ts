// @ts-ignore
import { ChatCompletionMessageParam } from 'openai/resources';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export type CallState = {
  audioStreamId: string | null;
  currentCall: VoiceResponse | null;
  recognizeStream: any;
  websocketConnection: any;
  messages: ChatCompletionMessageParam[];
};

const callStates: { [callId: string]: CallState } = {};

export const createCallState = (callId: string): CallState => {
  const initialState: CallState = {
    audioStreamId: null,
    currentCall: null,
    recognizeStream: null,
    websocketConnection: null,
    messages: [],
  };

  callStates[callId] = initialState;

  return initialState;
};

export const getCallState = (callId: string): CallState | undefined =>
  callStates[callId];

export const deleteCallState = (callId: string): void => {
  delete callStates[callId];
};

export const resetCallState = async (callId: string) => {
  const callState = getCallState(callId);

  if (!callState) return;

  try {
    if (callState.recognizeStream) {
      callState.recognizeStream.end();
      callState.recognizeStream = null;
    }

    callState.messages = [];
    deleteCallState(callId);
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        `There was a problem resetting state for call ID ${callId}: ${error.message}`,
      );
    }
  }

  deleteCallState(callId);
};
