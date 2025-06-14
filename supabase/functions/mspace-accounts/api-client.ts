
import { getEndpointAndPayload, buildGetUrl } from './operations.ts';

interface ApiRequestConfig {
  operation: string;
  username: string;
  apiKey: string;
  clientname?: string;
  noOfSms?: number;
}

export async function makeApiRequest(config: ApiRequestConfig) {
  const { endpoint, payload } = getEndpointAndPayload(config);

  console.log('Processing operation:', config.operation, 'for user:', config.username);

  // Try POST method first (more reliable according to docs)
  try {
    const postResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (postResponse.ok) {
      const responseText = await postResponse.text();
      console.log('POST response:', responseText);
      
      try {
        return JSON.parse(responseText);
      } catch {
        return { message: responseText, status: 'success' };
      }
    } else {
      throw new Error(`POST request failed: ${postResponse.status} ${postResponse.statusText}`);
    }
  } catch (postError) {
    console.log('POST method failed, trying GET method:', postError);
    
    return await tryGetMethod(config, endpoint);
  }
}

async function tryGetMethod(config: ApiRequestConfig, endpoint: string) {
  const { operation, apiKey, username, clientname, noOfSms } = config;
  
  const getUrl = buildGetUrl(operation, endpoint, apiKey, username, clientname, noOfSms);
  const getResponse = await fetch(getUrl);

  if (!getResponse.ok) {
    throw new Error(`Both POST and GET requests failed. Last error: ${getResponse.status} ${getResponse.statusText}`);
  }

  const responseText = await getResponse.text();
  console.log('GET response:', responseText);
  
  try {
    return JSON.parse(responseText);
  } catch {
    return { message: responseText, status: 'success' };
  }
}
