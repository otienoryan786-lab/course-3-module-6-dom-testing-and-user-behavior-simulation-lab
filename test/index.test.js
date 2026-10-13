/**
 * @jest-environment jsdom
 */

const {
  addElementToDOM,
  removeElementFromDOM,
  simulateClick,
  handleFormSubmit,
  createElementWithAttributes,
  init,
} = require('../index')

describe('DOM Testing and User Behavior Simulation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="dynamic-content"></div>
      <div id="error-message" class="hidden"></div>
      <form id="user-form">
        <input type="text" id="user-input" />
        <button type="submit">Submit</button>
      </form>
    `
  })

  it('should add an element to the DOM', () => {
    addElementToDOM('dynamic-content', 'Hello, World!')
    const dynamicContent = document.getElementById('dynamic-content')
    expect(dynamicContent.textContent).toContain('Hello, World!')
  })

  it('should remove an element from the DOM', () => {
    const element = document.createElement('div')
    element.id = 'test-element'
    document.body.appendChild(element)

    removeElementFromDOM('test-element')
    expect(document.getElementById('test-element')).toBeNull()
  })

  it('should simulate a button click and update the DOM', () => {
    simulateClick('dynamic-content', 'Button Clicked!')
    const dynamicContent = document.getElementById('dynamic-content')
    expect(dynamicContent.textContent).toContain('Button Clicked!')
  })

  it('should handle form submission and update the DOM', () => {
    const input = document.getElementById('user-input')
    input.value = 'Test Input'

    handleFormSubmit('user-form', 'dynamic-content')
    const dynamicContent = document.getElementById('dynamic-content')
    expect(dynamicContent.textContent).toContain('Test Input')
  })

  it('should display an error message for empty input', () => {
    handleFormSubmit('user-form', 'dynamic-content')
    const errorMessage = document.getElementById('error-message')
    expect(errorMessage.textContent).toBe('Input cannot be empty')
    expect(errorMessage.classList.contains('hidden')).toBe(false)
  })

  // ----- Bonus: edge cases -----

  it('should show an error when adding to a missing element', () => {
    const result = addElementToDOM('does-not-exist', 'Hi')
    expect(result).toBeNull()
    expect(document.getElementById('error-message').textContent).toContain('not found')
  })

  it('should show an error when removing a missing element', () => {
    expect(removeElementFromDOM('nope')).toBe(false)
    expect(document.getElementById('error-message').classList.contains('hidden')).toBe(false)
  })

  it('should reject whitespace-only input', () => {
    document.getElementById('user-input').value = '   '
    expect(handleFormSubmit('user-form', 'dynamic-content')).toBe(false)
    expect(document.getElementById('dynamic-content').children.length).toBe(0)
  })

  it('should clear the error and the input after a valid submission', () => {
    handleFormSubmit('user-form', 'dynamic-content')
    const input = document.getElementById('user-input')
    input.value = 'Valid'
    handleFormSubmit('user-form', 'dynamic-content')
    expect(document.getElementById('error-message').classList.contains('hidden')).toBe(true)
    expect(input.value).toBe('')
  })

  it('should create elements with attributes', () => {
    const el = createElementWithAttributes('a', { href: '#', class: 'link' })
    expect(el.tagName).toBe('A')
    expect(el.getAttribute('href')).toBe('#')
    expect(el.className).toBe('link')
  })

  it('should respond to real DOM events once init() has run', () => {
    document.body.insertAdjacentHTML('beforeend', '<button id="simulate-click">Go</button>')
    init()
    document.getElementById('simulate-click').click()
    expect(document.getElementById('dynamic-content').textContent).toContain('Button Clicked!')

    document.getElementById('user-input').value = 'via submit event'
    document.getElementById('user-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )
    expect(document.getElementById('dynamic-content').textContent).toContain('via submit event')
  })
})
