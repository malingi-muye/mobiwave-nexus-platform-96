
import { MspaceResponse, SendResult } from './types.ts'

export async function sendSMSToRecipient(
  recipient: string,
  message: string,
  apiKey: string,
  username: string,
  senderId: string
): Promise<SendResult> {
  try {
    console.log('Sending SMS to:', recipient.substring(0, 5) + '...')

    const mspaceResponse = await fetch('https://api.mspace.co.ke/smsapi/v2/sendtext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        username,
        senderId,
        recipient: recipient.replace(/\D/g, ''),
        message
      })
    })

    const responseData = await mspaceResponse.json() as MspaceResponse
    console.log('Mspace API response for', recipient + ':', responseData)

    let isSuccess = false
    let messageId = null
    let errorMessage = null

    if (mspaceResponse.ok && responseData.message && Array.isArray(responseData.message)) {
      const messageData = responseData.message.find(msg => msg.recipient === recipient.replace(/\D/g, ''))
      if (messageData) {
        isSuccess = messageData.status === 111
        messageId = messageData.messageId
        errorMessage = isSuccess ? null : messageData.statusDescription
      }
    } else {
      errorMessage = 'Invalid response format from Mspace API'
    }

    return {
      recipient,
      success: isSuccess,
      messageId,
      message: isSuccess ? 'Message sent successfully' : errorMessage || 'Failed to send',
      error: isSuccess ? undefined : errorMessage
    }

  } catch (error) {
    console.error('Error sending SMS to', recipient + ':', error)
    return {
      recipient,
      success: false,
      message: 'Failed to send',
      error: error.message
    }
  }
}
