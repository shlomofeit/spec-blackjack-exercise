export function errCreator(status = 500, message = "Internal server error") {
  const error = new Error();
  error.status = Number(status);
  error.message = {
    success: false,
    message: message,
  };

  return error;
}
