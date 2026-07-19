import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Restore admin session from localStorage on every page load
setAuthTokenGetter(() => localStorage.getItem('admin-session'));

createRoot(document.getElementById('root')!).render(<App />);
