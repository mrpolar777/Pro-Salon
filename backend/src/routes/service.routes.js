import { Router } from "express";
import * as serviceController from '../controllers/service.controller.js'

const router = Router()

router.get('/', serviceController.listAll)
router.get('/:id', serviceController.getById)
router.post('/', serviceController.create)
router.put('/:id', serviceController.update)
router.delete('/:id', serviceController.remove)

export default router