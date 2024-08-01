import { Index } from '@upstash/vector'
import csv from 'csv-parser'
import fs from 'fs'
import { Transform, pipeline } from 'stream'
import { promisify } from 'util'
import "dotenv/config"

console.log('URL:', process.env.UPSTASH_VECTOR_REST_URL);
console.log('Token:', process.env.UPSTASH_VECTOR_REST_TOKEN);

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN
})

// Define the structure of a row in the CSV file
interface Row {
  text: string
}

// Promisify the pipeline function for easier async/await usage
const asyncPipeline = promisify(pipeline)

/**
 * Creates a Transform stream that only processes lines within a specified range.
 * @param startLine - The starting line number (inclusive).
 * @param endLine - The ending line number (exclusive).
 * @returns A Transform stream that processes lines within the specified range.
 */
function createLineRangeStream(startLine: number, endLine: number) {
  let currentLine = 0
  return new Transform({
    transform(chunk, _, callback) {
      if (currentLine >= startLine && currentLine < endLine) {
        this.push(chunk)
      }
      currentLine++
      if (currentLine >= endLine) {
        this.push(null)
      }
      callback()
    },
    objectMode: true,
  })
}

/**
 * Creates a Transform stream that batches rows into arrays of a specified size.
 * @param batchSize - The number of rows per batch.
 * @returns A Transform stream that batches rows.
 */
function createBatchStream(batchSize: number) {
  let batch: Row[] = []
  return new Transform({
    transform(row: Row, _, callback) {
      batch.push(row)
      if (batch.length >= batchSize) {
        this.push(batch)
        batch = []
      }
      callback()
    },
    flush(callback) {
      if (batch.length > 0) {
        this.push(batch)
      }
      callback()
    },
    objectMode: true,
  })
}

/**
 * Processes a batch of rows by formatting and upserting them into the index.
 * @param batch - The batch of rows to process.
 * @param startId - The starting ID for the batch.
 */
async function processBatch(batch: Row[], startId: number) {
  const formatted = batch.map((row, batchIndex) => ({
    data: row.text,
    id: startId + batchIndex,
    metadata: { text: row.text },
  }))
  await index.upsert(formatted)
}

/**
 * Main function to seed the data from the CSV file into the Upstash vector index.
 */
const seed = async () => {
  const filePath = 'training_data.csv'
  const startLine = 0
  const endLine = 1585
  const batchSize = 30

  let currentId = 0

  await asyncPipeline(
    fs.createReadStream(filePath),
    csv({ separator: ',' }),
    createLineRangeStream(startLine, endLine),
    createBatchStream(batchSize),
    new Transform({
      objectMode: true,
      async transform(batch, _, callback) {
        await processBatch(batch, currentId)
        currentId += batch.length
        callback()
      }
    })
  )

  console.log('Data has been processed and indexed.')
}

seed()