type ToastOptions = { type?: 'success' | 'info' | 'error' }

let _show: ((msg: string, opts?: ToastOptions) => void) | null = null

export function registerToast(fn: ((msg: string, opts?: ToastOptions) => void) | null) {
  _show = fn
}

export function showToast(msg: string, opts?: ToastOptions) {
  if (_show) _show(msg, opts)
}

export default { registerToast, showToast }
