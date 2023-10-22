export type GetElementValue<TElement, TValue> = (element: TElement) => TValue;
export type SetElementValue<TElement, TValue> = (element: TElement, value: TValue) => void;
export type OnElementValueChange<TValue> = (newValue: TValue) => void;

class ElementObserver<TElement extends HTMLInputElement, TValue> {
  #value: TValue;
  #getElementValue: GetElementValue<TElement, TValue>;
  #setElementValue: SetElementValue<TElement, TValue>;
  #onChange?: OnElementValueChange<TValue>;

  protected element: TElement;

  constructor(
    selector: string,
    getElementValue: GetElementValue<TElement, TValue>,
    setElementValue: SetElementValue<TElement, TValue>,
    onChange?: OnElementValueChange<TValue>
  ) {
    const element = document.querySelector<TElement>(selector);
    if (!element) {
      throw new Error(`Element with selector <${selector}> not found.`);
    }

    this.element = element;
    this.#value = getElementValue(this.element);
    this.#getElementValue = getElementValue;
    this.#setElementValue = setElementValue;
    this.#onChange = onChange;

    this.#listen();
  }

  get value(): TValue {
    return this.#value;
  }

  set value(v: TValue) {
    this.#value = v;
    this.#setElementValue(this.element, v);
  }

  get disabled(): boolean {
    return this.element.disabled;
  }

  set disabled(v: boolean) {
    this.element.disabled = v;
  }

  #listen = (): this => {
    this.element.onchange = () => {
      this.#value = this.#getElementValue(this.element);
      this.#onChange?.(this.#value);
    };

    return this;
  };
}

export class InputNumberTypeObserver extends ElementObserver<HTMLInputElement, number> {
  constructor(selector: string, onChange?: OnElementValueChange<number>) {
    super(selector, getValueOfInputNumberType, setValueOfInputNumberType, onChange);
  }

  get max(): number {
    return parseInt(this.element.max, 10);
  }

  set max(value: number) {
    this.element.max = `${value}`;
  }
}

export class InputTextTypeObserver extends ElementObserver<HTMLInputElement, string> {
  constructor(selector: string, onChange?: OnElementValueChange<string>) {
    super(selector, getValueOfInputTextType, setValueOfInputTextType, onChange);
  }
}

const getValueOfInputNumberType: GetElementValue<HTMLInputElement, number> = (element: HTMLInputElement): number =>
  element.valueAsNumber;
const setValueOfInputNumberType: SetElementValue<HTMLInputElement, number> = (
  element: HTMLInputElement,
  value: number
) => {
  element.valueAsNumber = value;
};
const getValueOfInputTextType: GetElementValue<HTMLInputElement, string> = (element: HTMLInputElement): string =>
  element.value;
const setValueOfInputTextType: SetElementValue<HTMLInputElement, string> = (
  element: HTMLInputElement,
  value: string
) => {
  element.value = value;
};
