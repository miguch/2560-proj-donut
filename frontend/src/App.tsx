import { createContext, useMemo, useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { baseRouter } from './routes';
import useTheme from './hooks/useTheme';

import '@arco-design/web-react/dist/css/index.less';
import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';

function App() {
  useTheme();

  return (
    <ConfigProvider locale={enUS}>
      <div className="App">
        <RouterProvider router={baseRouter}></RouterProvider>
      </div>
    </ConfigProvider>
  );
}

export default App;
