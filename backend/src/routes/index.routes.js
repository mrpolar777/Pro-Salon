import { Router } from 'express'
import userRoutes from './user.routes.js'
import employeeRoutes from './employee.routes.js'
import serviceRoutes from './service.routes.js'
import appointmentRoutes from './appointment.routes.js'
import authRoutes from './auth.routes.js'

import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use('/auth', authRoutes)

router.use('/users', requireAuth, requireRole('admin'),userRoutes)

router.use('/employees', requireAuth,employeeRoutes)
router.use('/services', requireAuth,serviceRoutes)
router.use('/appointment', requireAuth, appointmentRoutes)

export default router