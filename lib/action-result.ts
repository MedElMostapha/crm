export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

export function success<T>(data: T, message?: string): ActionResult<T> {
  return { success: true, data, message };
}

export function failure(error: string): ActionResult<never> {
  return { success: false, error };
}
