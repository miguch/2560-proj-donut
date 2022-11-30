import { createContext, useMemo, useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

function App() {

  return (
    <div className="App">
      {/* <ColorModeContext.Provider value={colorMode}> */}
        {/* <ThemeProvider theme={theme}>
          <CssBaseline></CssBaseline>
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </ColorModeContext.Provider> */}
    </div>
  );
}

export default App;
