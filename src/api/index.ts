import { Router } from 'express'
import auth from './routes/auth'

export default (passport) => {
  const app = Router()
  auth(app, passport)

  return app
}
