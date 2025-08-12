import express from 'express'
import loginControl from '../controllers/loginController.js'

const router = express.Router()

router.route('/').post(loginControl.login)
router.route('/isLoggedIn').get(loginControl.isLoggedIn)
router.route('/auth/me').get(loginControl.getAuthenticatedUser)
router.route('/logout').post(loginControl.logout) 

export default router