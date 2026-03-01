import { Router } from 'express'
import * as ctrl from '../controllers/apiKeysController.js'

export const apiKeysRoutes = Router()

apiKeysRoutes.post('/', ctrl.createKey)
apiKeysRoutes.get('/', ctrl.listKeys)
apiKeysRoutes.delete('/:id', ctrl.deleteKey)
