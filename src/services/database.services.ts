import { config } from 'dotenv'
import mongoose from 'mongoose'
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ryellf9.mongodb.net/retryWrites=true&w=majority`

class DatabaseService {
  async connect() {
    try {
      mongoose.set('strictQuery', false)
      mongoose.connect(uri, { dbName: process.env.DB_NAME }).then(() => {
        console.log('MongoDB Connected')
      })
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }
}

// Tạo object từ class DatabaseService
const databaseService = new DatabaseService()
export default databaseService
