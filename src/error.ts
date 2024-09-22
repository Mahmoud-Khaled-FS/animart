export function windowErrorHandler(message: string | Event): boolean {
  const errorElement = document.getElementById('error') as HTMLElement;
  if (!errorElement) {
    return false;
  }
  errorElement.innerHTML = message as string;
  errorElement.style.display = 'block';
  return false;
}
