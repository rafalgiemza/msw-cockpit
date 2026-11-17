import { setupWorker } from 'msw/browser'
import type { MswWorker } from '../../src/core/types'

// Regression: MSW's real SetupWorker must stay assignable to MswWorker
// (its start() resolves to a ServiceWorkerRegistration, not void).
export const worker: MswWorker = setupWorker()
