import { Index } from '@upstash/vector'
import "dotenv/config"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN
})

async function test() {
  try {
    await index.reset()
    console.log('Connection successful')
  } catch (error) {
    console.error('Error:', error)
  }
}

test()