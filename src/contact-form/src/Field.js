import Validator from "./Validator";

export default class Field {
  rules = [];
  form = undefined
  validator = undefined;
  valid = true;

  constructor(element, rules, form) {
    this.element = element;
    this.form = form
    if (rules) {
      this.rules = rules
      this.validator = new Validator(this.rules)
    } else {
      this.validator = new Validator({})
    }

    if(form.live) {
      this.element.addEventListener('input', e => {
        if (!this.valid) {
          this.validate()
        }
      })
    }
  }

  validate() {
    this.valid = this.validator.validate(this.value)
    if (this.valid) {
      this.hideError()
    } else {
      this.showError()
    }
    return this.valid
  }

  showError() {
    this.element.classList.add('has-error');
    this.element.dispatchEvent(new Event('validation-failed'));
    for (const label of this.form.element.querySelectorAll(`label[for="${this.name}"]`)) {
      label.classList.add('has-error')
    }
  }

  hideError() {
    this.element.classList.remove('has-error');
    if (this.validator.validate(this.value)) {
      this.element.dispatchEvent(new Event('validation-succeeded'));
    }
    for (const label of this.form.element.querySelectorAll(`label[for="${this.name}"]`)) {
      label.classList.remove('has-error')
    }
  }

  get name() {
    return this.element.name;
  }

  get value() {
    if (this.element.type === 'checkbox') {
      return this.element.checked
    } else {
      return this.element.value;
    }
  }
}
