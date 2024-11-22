import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../../types';

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
  const errorSources: TErrorSource = Object.values(err?.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    },
  );

  return {
    statusCode: 400,
    message: 'Validation Error!',
    errorSources,
  };
};

export default handleValidationError;
