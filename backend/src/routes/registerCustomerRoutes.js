import express from 'express'
import register from '../controllers/registerCustomerController.js'

const router = express.Router()

router.post('/', register.registerCustomer)
router.post('/verify', register.verificationCode)

export default router