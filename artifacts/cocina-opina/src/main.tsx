import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Para despliegue en Vercel: apunta al backend desplegado en Replit
// Establece la variable VITE_API_URL en Vercel con la URL de tu backend
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl.replace(/\/$/, ''));
}

// Restaura la sesión de admin desde localStorage al cargar la página
setAuthTokenGetter(() => localStorage.getItem('admin-session'));

createRoot(document.getElementById('root')!).render(<App />);
