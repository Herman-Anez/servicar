export class Matricula {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim().toUpperCase();
    if (!trimmed) throw new Error("La matrícula no puede estar vacía.");
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Matricula): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
