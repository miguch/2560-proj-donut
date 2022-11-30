import { Button } from '@arco-design/web-react';
import { IconMoon, IconSun } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { HeaderActions, HeaderContainer, HeaderTitle } from './layout.style';

export default function Header() {
  const isDarkMode = document.body.getAttribute('arco-theme') === 'dark';
  const [_, rerender] = useState({});

  function switchTheme() {
    if (isDarkMode) {
      document.body.removeAttribute('arco-theme');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
    rerender({});
  }

  return (
    <div className="arco-theme" arco-theme="dark">
      <HeaderContainer>
        <HeaderTitle>PittCourse?</HeaderTitle>
        <HeaderActions>
          <Button
            type="text"
            size="large"
            shape="circle"
            style={{ color: 'white' }}
            onClick={switchTheme}
            icon={isDarkMode ? <IconMoon /> : <IconSun />}
          ></Button>
        </HeaderActions>
      </HeaderContainer>
    </div>
  );
}
