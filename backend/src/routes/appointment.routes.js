import { Router } from "express";
import * as appointmentController from '../controllers/appointment.controller.js'

const router = Router()

router.get('/', appointmentController.listAll)
router.get('/:id', appointmentController.getById)
router.post('/', appointmentController.create)
router.put('/:id', appointmentController.update)
router.delete('/:id', appointmentController.remove)

export default router