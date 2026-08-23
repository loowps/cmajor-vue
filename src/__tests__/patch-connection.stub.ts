import { vi } from 'vitest'
import type { PatchConnection } from '@/models/patch-connection.model'

export function createStubPatchConnection() {
  return {
    addParameterListener: vi.fn(),
    removeParameterListener: vi.fn(),
    addEndpointListener: vi.fn(),
    removeEndpointListener: vi.fn(),
    requestParameterValue: vi.fn(),
    sendEventOrValue: vi.fn(),
    sendParameterGestureStart: vi.fn(),
    sendParameterGestureEnd: vi.fn()
  } as unknown as PatchConnection
}
