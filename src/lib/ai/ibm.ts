import type { AIAdvisory } from "@/types/advisory";

interface IAMTokenResponse {
  access_token: string;
  expires_in: number;
  expiration: number;
  token_type: string;
}

interface WatsonxTextGenResponse {
  model_id: string;
  created_at: string;
  results: Array<{
    generated_text: string;
    generated_token_count?: number;
    input_token_count?: number;
    stop_reason?: string;
  }>;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getWatsonxIAMToken(apiKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(
      apiKey
    )}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `IBM IAM authentication failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as IAMTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600),
  };

  return data.access_token;
}

export function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
 
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export async function generateWatsonxAdvisory(
  prompt: string
): Promise<AIAdvisory> {
  const apiKey =
    process.env.WATSONX_API_KEY || process.env.IBM_CLOUD_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const baseUrl =
    process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com";
  const modelId =
    process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct";

  if (!apiKey) {
    throw new Error(
      "WATSONX_API_KEY or IBM_CLOUD_API_KEY is not configured in environment."
    );
  }

  if (!projectId) {
    throw new Error(
      "WATSONX_PROJECT_ID is not configured in environment."
    );
  }

  const token = await getWatsonxIAMToken(apiKey);

  const endpoint = `${baseUrl.replace(
    /\/$/,
    ""
  )}/ml/v1/text/generation?version=2023-05-29`;

  const payload = {
    model_id: modelId,
    project_id: projectId,
    input: prompt,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 1500,
      min_new_tokens: 1,
      temperature: 0.2,
      repetition_penalty: 1.05,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Watsonx.ai text generation failed (${response.status}): ${errorBody}`
    );
  }

  const data = (await response.json()) as WatsonxTextGenResponse;
  const generatedText = data.results?.[0]?.generated_text;

  if (!generatedText) {
    throw new Error("Watsonx Granite model returned an empty completion.");
  }

  const cleaned = cleanJsonOutput(generatedText);
  return JSON.parse(cleaned) as AIAdvisory;
}

export async function callWatsonxText(prompt: string): Promise<string> {
  const apiKey =
    process.env.WATSONX_API_KEY || process.env.IBM_CLOUD_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const baseUrl =
    process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com";
  const modelId =
    process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct";

  if (!apiKey || !projectId) {
    throw new Error("Watsonx credentials not configured.");
  }

  const token = await getWatsonxIAMToken(apiKey);
  const endpoint = `${baseUrl.replace(
    /\/$/,
    ""
  )}/ml/v1/text/generation?version=2023-05-29`;

  const payload = {
    model_id: modelId,
    project_id: projectId,
    input: prompt,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 800,
      min_new_tokens: 1,
      temperature: 0.3,
      repetition_penalty: 1.05,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Watsonx text generation failed (${response.status}): ${errorBody}`
    );
  }

  const data = (await response.json()) as WatsonxTextGenResponse;
  const generatedText = data.results?.[0]?.generated_text;

  if (!generatedText) {
    throw new Error("Watsonx Granite model returned an empty completion.");
  }

  return generatedText.trim();
}
