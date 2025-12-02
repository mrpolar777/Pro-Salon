import { Router } from "express";
import * as employeeController from '../controllers/employee.controller.js'

const router = Router()

router.get('/', employeeController.listAll)
router.get('/:id', employeeController.getById)
router.post('/', employeeController.create)
router.put('/:id', employeeController.update)
router.delete('/:id', employeeController.remove)

export default router