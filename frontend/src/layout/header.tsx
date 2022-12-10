import { Button, Drawer, Link, Menu, Modal } from '@arco-design/web-react';
import { IconMoon, IconNav, IconSun } from '@arco-design/web-react/icon';
import { useState } from 'react';
import useUser from '../hooks/useUser';
import Avatar from './avatar';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import {
  HeaderActions,
  HeaderContainer,
  HeaderNavBar,
  HeaderNavButton,
  HeaderTitle,
} from './layout.style';
export default function Header() {
  const isDarkMode = document.body.getAttribute('arco-theme') === 'dark';
  const [_, rerender] = useState({});
  const { user, error, isLoading } = useUser();

  function switchTheme() {
    if (isDarkMode) {
      document.body.removeAttribute('arco-theme');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
    rerender({});
  }

  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigations = {
    admin: [
      {
        title: 'Students',
        path: '/students',
      },
      {
        title: 'Teachers',
        path: '/teachers',
      },
      {
        title: 'Accounts',
        path: '/accounts',
      },
      {
        title: 'Courses',
        path: '/courses',
      },
    ],
    teacher: [
      {
        title: 'Courses',
        path: '/courses',
      },
    ],
    student: [
      { title: 'Course List', path: '/courselist' },
      {
        title: 'Enrollment',
        path: '/enrollment',
      },
    ],
  } as const;

  return (
    <div className="arco-theme" arco-theme="dark">
      <HeaderContainer>
        <HeaderNavButton>
          <Button
            onClick={() => setDrawerVisible(true)}
            icon={<IconNav></IconNav>}
          ></Button>
          {user && (
            <Drawer
              visible={drawerVisible}
              footer={null}
              onCancel={() => setDrawerVisible(false)}
            >
              <Menu style={{ backgroundColor: 'unset' }}>
                {user?.type &&
                  navigations[user.type].map(({ title, path }) => (
                    <RouterLink
                      onClick={() => setDrawerVisible(false)}
                      to={path}
                      key={path}
                    >
                      <Menu.Item key={path}>{title}</Menu.Item>
                    </RouterLink>
                  ))}
              </Menu>
            </Drawer>
          )}
        </HeaderNavButton>
        <NavLink to={'/'} style={{ textDecoration: 'none' }}>
          <HeaderTitle>PittCourse</HeaderTitle>
        </NavLink>
        <HeaderNavBar>
          {user?.type &&
            navigations[user.type].map(({ title, path }) => (
              <RouterLink key={path} to={path}>
                <Link>{title}</Link>
              </RouterLink>
            ))}
        </HeaderNavBar>
        <HeaderActions>
          <Button
            type="text"
            size="large"
            shape="circle"
            style={{ color: 'white' }}
            onClick={switchTheme}
            icon={isDarkMode ? <IconMoon /> : <IconSun />}
          ></Button>
          <Avatar></Avatar>
        </HeaderActions>
      </HeaderContainer>
    </div>
  );
}
