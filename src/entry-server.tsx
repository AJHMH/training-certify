import {
  createStartHandler,
  defaultRenderHandler,
} from '@tanstack/react-start/server'
import { validateEnv } from './lib/env'
import { initSentry } from './lib/sentry.server'
import { initLogging } from './lib/logging.server'
import { applySecurityHeaders } from './lib/securityHeaders.server'

// Initialize logging first
initLogging()

// Fail fast on invalid/missing required environment (server only)
validateEnv()

// Initialize Sentry on server startup
initSentry()

type RenderOpts = Parameters<typeof defaultRenderHandler>[0]

async function secureRenderHandler(opts: RenderOpts) {
  const result = await defaultRenderHandler(opts)
  if (result instanceof Response) return applySecurityHeaders(result)
  return { ...result, response: applySecurityHeaders(result.response) }
}

export default createStartHandler(secureRenderHandler)
