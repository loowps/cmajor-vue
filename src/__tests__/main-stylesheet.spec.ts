import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { PatchConnection } from '@/models/patch-connection.model'
import { createStubPatchConnection } from '@/__tests__/patch-connection.stub'

let createPatchView: (patchConnection: PatchConnection) => HTMLElement

beforeAll(async () => {
  vi.stubEnv('DEV', false)
  createPatchView = (await import('@/main')).default
})

const attachedViews: HTMLElement[] = []

function attach() {
  const view = createPatchView(createStubPatchConnection())
  attachedViews.push(view)
  document.body.appendChild(view)
  return view
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve))
  await new Promise((resolve) => setTimeout(resolve))
}

function bundledStylesheets() {
  return [...document.head.querySelectorAll('link[rel="stylesheet"]')]
}

afterEach(() => {
  attachedViews.splice(0).forEach((view) => view.remove())
})

describe('patch view stylesheet', () => {
  it('adds the bundled stylesheet to the document head', () => {
    expect(bundledStylesheets()).toHaveLength(1)
    expect(bundledStylesheets()[0].getAttribute('href')).toMatch(/style\.css$/)
  })

  it('holds the app back until the stylesheet has loaded', async () => {
    const view = attach()
    await settle()

    expect(view.innerHTML).toBe('')

    bundledStylesheets()[0].dispatchEvent(new Event('load'))
    await settle()

    expect(view.querySelector('header')?.textContent).toContain('Cmajor + VueJs')
  })

  it('mounts without adding a second stylesheet once it has loaded', async () => {
    const view = attach()
    await settle()

    expect(view.querySelector('header')?.textContent).toContain('Cmajor + VueJs')
    expect(bundledStylesheets()).toHaveLength(1)
  })
})
