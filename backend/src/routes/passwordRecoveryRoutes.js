import express from 'express'
import passRecov from '../controllers/passwordRecoveryController.js'

const router = express.Router()

router.post('/requestCode', passRecov.requestCode)
router.post('/verifyCode', passRecov.verifyCode)
router.get('/getTokenInfo', passRecov.getTokenInfo) // Nueva ruta
router.post('/resetPassword', passRecov.resetPassword)

export default router