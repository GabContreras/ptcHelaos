import express from 'express'
import loginControl from '../controllers/loginController.js'

const router = express.Router()

router.route('/').post(loginControl.login)
router.route('/isLoggedIn').get(loginControl.isLoggedIn)

export default router