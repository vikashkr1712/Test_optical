import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import './styles/global.css';
import './styles/responsive.css';
import './styles/readability.css';

createRoot(document.getElementById('root')).render(<App />);
