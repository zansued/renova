class ZodString {
  constructor() {
    this._trim = false;
    this._checks = [];
  }

  trim() {
    this._trim = true;
    return this;
  }

  min(length, message) {
    this._checks.push({ type: 'min', length, message });
    return this;
  }

  max(length, message) {
    this._checks.push({ type: 'max', length, message });
    return this;
  }

  regex(pattern, message) {
    this._checks.push({ type: 'regex', pattern, message });
    return this;
  }

  _prepare(value) {
    if (typeof value !== 'string') {
      return { success: false, errors: [{ message: 'Deve ser um texto' }] };
    }
    const prepared = this._trim ? value.trim() : value;

    for (const check of this._checks) {
      if (check.type === 'min' && prepared.length < check.length) {
        return { success: false, errors: [{ message: check.message }] };
      }
      if (check.type === 'max' && prepared.length > check.length) {
        return { success: false, errors: [{ message: check.message }] };
      }
      if (check.type === 'regex' && !check.pattern.test(prepared)) {
        return { success: false, errors: [{ message: check.message }] };
      }
    }

    return { success: true, data: prepared };
  }

  safeParse(value) {
    const result = this._prepare(value);
    if (!result.success) {
      return { success: false, error: { errors: result.errors } };
    }
    return { success: true, data: result.data };
  }
}

class ZodObject {
  constructor(shape) {
    this.shape = shape;
  }

  safeParse(input) {
    if (typeof input !== 'object' || input === null) {
      return { success: false, error: { errors: [{ message: 'Payload inválido' }] } };
    }

    const data = {};
    const errors = [];

    Object.entries(this.shape).forEach(([key, schema]) => {
      const result = schema.safeParse(input[key]);
      if (!result.success) {
        errors.push(...result.error.errors.map(err => ({ ...err, path: key })));
      } else {
        data[key] = result.data;
      }
    });

    if (errors.length > 0) {
      return { success: false, error: { errors } };
    }

    return { success: true, data };
  }
}

export const z = {
  string: () => new ZodString(),
  object: shape => new ZodObject(shape),
};
