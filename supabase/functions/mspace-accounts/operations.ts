
interface OperationConfig {
  operation: string;
  username: string;
  clientname?: string;
  noOfSms?: number;
}

export function getEndpointAndPayload(config: OperationConfig) {
  const { operation, username, clientname, noOfSms } = config;
  
  let endpoint = '';
  let payload: any = { username };
  
  switch(operation) {
    case 'subAccounts':
      endpoint = 'https://api.mspace.co.ke/smsapi/v2/subusers';
      break;
    case 'resellerClients':
      endpoint = 'https://api.mspace.co.ke/smsapi/v2/resellerclients';
      break;
    case 'topUpSubAccount':
      if (!clientname || !noOfSms) {
        throw new Error('Client name and SMS quantity required for top-up');
      }
      endpoint = 'https://api.mspace.co.ke/smsapi/v2/subacctopup';
      payload = {
        username,
        subaccname: clientname,
        noOfSms
      };
      break;
    case 'topUpResellerClient':
      if (!clientname || !noOfSms) {
        throw new Error('Client name and SMS quantity required for top-up');
      }
      endpoint = 'https://api.mspace.co.ke/smsapi/v2/resellerclienttopup';
      payload = {
        username,
        clientname,
        noOfSms
      };
      break;
    default:
      throw new Error(`Invalid operation: ${operation}`);
  }

  return { endpoint, payload };
}

export function buildGetUrl(operation: string, endpoint: string, apiKey: string, username: string, clientname?: string, noOfSms?: number) {
  switch(operation) {
    case 'subAccounts':
    case 'resellerClients':
      return `${endpoint}/apikey=${apiKey}/username=${username}`;
    case 'topUpSubAccount':
      return `${endpoint}/apikey=${apiKey}/username=${username}/subaccname=${clientname}/noofsms=${noOfSms}`;
    case 'topUpResellerClient':
      return `${endpoint}/apikey=${apiKey}/username=${username}/clientname=${clientname}/noofsms=${noOfSms}`;
    default:
      throw new Error(`GET URL not supported for operation: ${operation}`);
  }
}
