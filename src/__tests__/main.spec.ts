import { afterEach, describe, expect, it } from 'vitest'
import createPatchView, { cmajViewElementTag } from '@/main'
import { createStubPatchConnection } from '@/__tests__/patch-connection.stub'

const attachedViews: HTMLElement[] = []

function attach(view: HTMLElement) {
  attachedViews.push(view)
  document.body.appendChild(view)
  return view
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve))
  await new Promise((resolve) => setTimeout(resolve))
}

afterEach(() => {
  attachedViews.splice(0).forEach((view) => view.remove())
})

describe('patch view element', () => {
  it('registers itself under the cmaj view tag', () => {
    expect(customElements.get(cmajViewElementTag)).toBeDefined()
  })

  it('creates elements that the browser recognises as upgraded', () => {
    const view = createPatchView(createStubPatchConnection())

    expect(view).toBeInstanceOf(customElements.get(cmajViewElementTag)!)
    expect(view.localName).toBe(cmajViewElementTag)
  })

  it('mounts the app once it is connected to the document', async () => {
    const view = attach(createPatchView(createStubPatchConnection()))

    await settle()

    expect(view.querySelector('header')?.textContent).toContain('Cmajor + VueJs')
  })

  it('hands the patch connection to the view', async () => {
    const patchConnection = createStubPatchConnection()

    attach(createPatchView(patchConnection))
    await settle()

    expect(patchConnection.requestParameterValue).toHaveBeenCalledWith('gainParam')
    expect(patchConnection.addParameterListener).toHaveBeenCalledWith(
      'gainParam',
      expect.any(Function)
    )
  })

  it('tears the app down when it is removed from the document', async () => {
    const patchConnection = createStubPatchConnection()
    const view = attach(createPatchView(patchConnection))

    await settle()
    view.remove()

    expect(view.innerHTML).toBe('')
    expect(patchConnection.removeParameterListener).toHaveBeenCalledWith(
      'gainParam',
      expect.any(Function)
    )
    expect(patchConnection.removeEndpointListener).toHaveBeenCalledWith(
      'levelOut',
      expect.any(Function)
    )
  })

  it('does not mount when it is removed before mounting completes', async () => {
    const patchConnection = createStubPatchConnection()
    const view = attach(createPatchView(patchConnection))

    view.remove()
    await settle()

    expect(view.innerHTML).toBe('')
    expect(patchConnection.addParameterListener).not.toHaveBeenCalled()
  })

  it('mounts again when it is reattached', async () => {
    const view = attach(createPatchView(createStubPatchConnection()))

    await settle()
    view.remove()

    attach(view)
    await settle()

    expect(view.querySelector('header')?.textContent).toContain('Cmajor + VueJs')
  })
})
