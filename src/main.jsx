import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './Components/App';
import appStore from './Utils/appStore';
import { Provider } from "react-redux";
import SessionLoader from './Components/SessionLoader';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {appStore}>
      <BrowserRouter>
        <SessionLoader>
          <App />
        </SessionLoader>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
