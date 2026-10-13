// ---------- Reusable utilities ----------

function createElementWithAttributes(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([attr, value]) => {
    element.setAttribute(attr, value);
  });
  return element;
}

function displayError(message) {
  const errorElement = document.getElementById('error-message');
  if (!errorElement) return false;
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  return true;
}

function clearError() {
  const errorElement = document.getElementById('error-message');
  if (!errorElement) return;
  errorElement.textContent = '';
  errorElement.classList.add('hidden');
}

// ---------- DOM manipulation ----------

function addElementToDOM(targetId, content) {
  const target = document.getElementById(targetId);
  if (!target) {
    displayError(`Element with id "${targetId}" not found`);
    return null;
  }
  const paragraph = createElementWithAttributes('p', { class: 'dynamic-item' });
  paragraph.textContent = content;
  target.appendChild(paragraph);
  return paragraph;
}

function removeElementFromDOM(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    displayError(`Element with id "${elementId}" not found`);
    return false;
  }
  element.remove();
  return true;
}

// ---------- User behavior simulation ----------

function simulateClick(targetId, message) {
  clearError();
  return addElementToDOM(targetId, message);
}

function handleFormSubmit(formId, targetId) {
  const form = document.getElementById(formId);
  if (!form) {
    displayError(`Form with id "${formId}" not found`);
    return false;
  }
  const input = form.querySelector('input[type="text"]');
  const value = input ? input.value.trim() : '';

  if (!value) {
    displayError('Input cannot be empty');
    return false;
  }

  clearError();
  addElementToDOM(targetId, value);
  input.value = '';
  return true;
}

// ---------- Wire up the real page ----------

function init() {
  const button = document.getElementById('simulate-click');
  const form = document.getElementById('user-form');

  if (button) {
    button.addEventListener('click', () =>
      simulateClick('dynamic-content', 'Button Clicked!')
    );
  }
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleFormSubmit('user-form', 'dynamic-content');
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    createElementWithAttributes,
    displayError,
    clearError,
    addElementToDOM,
    removeElementFromDOM,
    simulateClick,
    handleFormSubmit,
    init,
  };
}
