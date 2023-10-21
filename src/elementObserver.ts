export type GetElementValue<TElement, TValue> = (element: TElement) => TValue;
export type SetElementValue<TElement, TValue> = (element: TElement, value: TValue) => void;
export type OnElementValueChange<TValue> = (newValue: TValue) => void;

class ElementObserver<TElement extends HTMLInputElement, TValue> {
  private _element: TElement;
  private _listening = false;
  private _value: TValue;
  private _getElementValue: GetElementValue<TElement, TValue>;
  private _setElementValue: SetElementValue<TElement, TValue>;
  private _onChange?: OnElementValueChange<TValue>;

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

    this._element = element;
    this._value = getElementValue(this._element);
    this._getElementValue = getElementValue;
    this._setElementValue = setElementValue;
    this._onChange = onChange;
  }

  get value(): TValue {
    return this._value;
  }

  set value(v: TValue) {
    this._value = v;
    this._setElementValue(this._element, v);
  }

  get disabled(): boolean {
    return this._element.disabled;
  }

  set disabled(v: boolean) {
    this._element.disabled = v;
  }

  listen = (): this => {
    if (this._listening) {
      throw new Error('ElementObserver already initialized');
    }

    this._element.onchange = () => {
      this._value = this._getElementValue(this._element);
      this._onChange?.(this._value);
    };

    this._listening = true;
    return this;
  };
}

export class InputNumberTypeObserver extends ElementObserver<HTMLInputElement, number> {
  constructor(selector: string, onChange?: OnElementValueChange<number>) {
    super(selector, getValueOfInputNumberType, setValueOfInputNumberType, onChange);
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
