import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  Validator,
} from 'class-validator';
import * as _ from 'lodash';

const typeValidator = {
  string: (value: any, args: ValidationArguments) => {
    return _.isString(value);
  },
  int: (value: any, args: ValidationArguments) => {
    return _.isInteger(value);
  },
  boolean: (value: any, args: ValidationArguments) => {
    return _.isBoolean(value);
  },
  // Add more here
};

export function IsType(
  types: (keyof typeof typeValidator)[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'wrongType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return types.some((v) => typeValidator[v](value, args));
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          const lastType = types.pop();
          if (types.length == 0) return `Has to be ${lastType}`;
          return `Can only be ${types.join(', ')} or ${lastType}.`;
        },
      },
    });
  };
}
