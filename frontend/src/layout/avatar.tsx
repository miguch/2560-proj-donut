import {
  Button,
  Divider,
  Dropdown,
  Image,
  Menu,
  Modal,
} from '@arco-design/web-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { AvatarContainer } from './layout.style';

export default function Avatar() {
  const { user, isLoading, error } = useUser();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const onAction = async (key: string) => {
    switch (key) {
      case 'profile':
        setShowProfile(true);
        break;
      case 'logoff':
        await fetch('/api/auth/logoff');
        navigate('/login');
        break;
    }
  };

  const avatarActions = (
    <Menu onClickMenuItem={onAction}>
      <Menu.Item key="profile">Profile</Menu.Item>
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
          src={user!.avatar || 'default.png'}
          style={{ cursor: 'pointer' }}
          width="100%"
        ></Image>
      </Dropdown>

      <Modal
        footer={null}
        onCancel={() => setShowProfile(false)}
        title="User Profile"
        visible={showProfile}
        style={{ textAlign: 'center', maxWidth: '80%' }}
      >
        <Image src={user?.avatar || 'default.png'} width="50px" height="50px"></Image>
        {[
          {
            label: 'Username',
            field: 'username',
          },
          {
            label: 'Type',
            field: 'type',
          },
        ].map(({ label, field }) => (
          <div key={field}>
            {label}: <b>{(user as any)[field]}</b>
          </div>
        ))}
      </Modal>
    </AvatarContainer>
  );
}
