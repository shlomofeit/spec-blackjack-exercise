export async function errCreator(
  status = 500,
  message = "Internal server error",
) {
  const error = new Error();
  error.status = status;
  error.message = message;

  return error;
}
