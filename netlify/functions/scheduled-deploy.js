const fetch = require('node-fetch')
import { schedule } from '@netlify/functions'

const BUILD_HOOK = 'https://api.netlify.com/build_hooks/65e0fd9b2c19113a0724088b'

// Schedules the handler function to run at 5am every day
const handler = schedule('0 5 * * *', async () => {
    await fetch(BUILD_HOOK, {
      method: 'POST'
    }).then(response => {
      console.log('Build hook response:', response)
    })
  
    return {
      statusCode: 200
    }
  })
  
  export { handler }