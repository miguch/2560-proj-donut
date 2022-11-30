import { Button, Divider, Dropdown, Image, Menu } from '@arco-design/web-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { AvatarContainer } from './layout.style';

export default function Avatar() {
  const { user, isLoading, error } = useUser();

  const onAction = (key: string) => {
    switch (key) {
      case 'profile':
        break;
      case 'logoff':
        window.location.reload();
        break;
    }
  };

  const avatarActions = (
    <Menu onClickMenuItem={onAction}>
      <Menu.Item key="profile">
        <Link to={`/profile`}>Profile</Link>
      </Menu.Item>
      <Divider style={{ margin: '2px 0' }}></Divider>
      <Menu.Item key="logoff">Log Off</Menu.Item>
    </Menu>
  );

  if (isLoading || !!error) {
    return null;
  }
  return (
    <AvatarContainer>
      <Dropdown droplist={avatarActions}>
        <Image
          alt="user avatar"
          preview={false}
          src={user!.avatar}
          style={{ cursor: 'pointer' }}
          width="100%"
        ></Image>
      </Dropdown>
    </AvatarContainer>
  );
}
