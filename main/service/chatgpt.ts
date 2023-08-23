import { Api } from "../config/api";

export async function postSendMessageToChatGPT({ prompt }) {
  return await Api.request().post(
    "/v1/engines/text-davinci-003-playground/completions",
    {
      prompt: prompt,
      temperature: 0.22,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }
  );
}
