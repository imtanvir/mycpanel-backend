import { TErrorSource, TGenericErrorResponse } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extracted_message = match && match[1];
  const errorSources: TErrorSource = [
    {
      path: err.keyValue,
      message: extracted_message,
    },
  ];
  return {
    statusCode: 11000,
    message: `${extracted_message} is already exist!`,
    errorSources: errorSources,
  };
};

export default handleDuplicateError;
