import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import userRouters from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
import '~/utils/s3'
import addressRouter from './routes/address.routes'
import adminsArticlesRouter from './routes/admins.articles.routes'
import adminsCategoriesRouter from './routes/admins.categories.routes'
import adminsUsersRouter from './routes/admins.users.routes'
import appointmentsRouter from './routes/appointments.routes'
import commentsRouter from './routes/comments.routes'
import mediasRouter from './routes/medias.routes'
import usersArticlesRouter from './routes/users.articles.routes'
import usersCategoriesRouter from './routes/users.categories.routes'
import usersFavoritesRouter from './routes/users.favourites.routes'
import { socketServices } from './services/sockets.services'
import { defaultErrorHandler } from './utils/handlers'
const app = express()

const port = 3000
// parse ra JSON. Nếu không có dòng này thì req.body sẽ là undefined. (.use) kiểu như là middleware nhưng toàn bộ request sẽ đi qua

;(global as any).appRoot = path.resolve(__dirname)

// Gọi là app handler
app.use(cors())
app.use(express.json())

databaseService.connect()

// Tạo folder upload
initFolder()

// Gọi là route handler
app.use('/api/v1/users', userRouters)
app.use('/api/v1/address', addressRouter)
app.use('/api/v1/medias', mediasRouter)
app.use('/api/v1/admin/users', adminsUsersRouter)
app.use('/api/v1/admin/categories', adminsCategoriesRouter)
app.use('/api/v1/admin/articles', adminsArticlesRouter)
app.use('/api/v1/articles', usersArticlesRouter)
app.use('/api/v1/categories', usersCategoriesRouter)
app.use('/api/v1/favorites', usersFavoritesRouter)
app.use('/api/v1/appointments', appointmentsRouter)
app.use('/api/v1/comments', commentsRouter)

app.use(defaultErrorHandler)

const httpsServer = http.createServer(app)
const io = new Server(httpsServer, {
  cors: {
    origin: '*'
  }
})

;(global as any).socket = io
;(global as any).socket.on('connection', socketServices)

httpsServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Socket.IO connection
