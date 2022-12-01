import { Button, Divider, Form, Input, Select } from '@arco-design/web-react';
import useForm from '@arco-design/web-react/es/Form/useForm';

import { IconGithub } from '@arco-design/web-react/icon';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginTitle } from './login.style';

interface LoginFormProps {
  isPage?: boolean;
  onLoginSuccess?: (() => void) | undefined;
}

export default function LoginForm({
  isPage = false,
  onLoginSuccess,
}: LoginFormProps) {
  const { search } = useLocation();

  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupForm] = useForm();

  function onGitHubLogin() {
    window.location.href = '/api/login/github' + location.search;
  }

  function onLogin() {}

  function onSignup() {}

  return (
    <>
      <LoginTitle>CourseNet</LoginTitle>
      <Button type="primary" onClick={onGitHubLogin} icon={<IconGithub />}>
        Sign In with GitHub
      </Button>
      <Divider></Divider>
      {!isSignup && (
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="Username" field="username">
            <Input placeholder="username / email"></Input>
          </Form.Item>

          <Form.Item label="Password" field="password">
            <Input type="password" placeholder="password"></Input>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" onClick={onLogin}>
              Login
            </Button>
            <Divider type="vertical"></Divider>
            <Button loading={isSubmitting} onClick={() => setIsSignup(true)}>
              Signup
            </Button>
          </Form.Item>
        </Form>
      )}
      {isSignup && (
        <Form
          form={signupForm}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="Type"
            field="type"
            rules={[{ required: true }]}
            initialValue="student"
          >
            <Select placeholder="Type">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="instructor">Instructor</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Username"
            field="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="username"></Input>
          </Form.Item>

          <Form.Item
            label="Email"
            field="email"
            rules={[
              { required: true },
              {
                match:
                  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                message: 'Please enter valid email',
              },
            ]}
          >
            <Input placeholder="email"></Input>
          </Form.Item>

          <Form.Item
            label="Name"
            field="displayName"
            rules={[{ required: true }]}
          >
            <Input placeholder="name"></Input>
          </Form.Item>

          <Form.Item
            label="Password"
            field="password"
            rules={[{ required: true }]}
          >
            <Input type="password" placeholder="password"></Input>
          </Form.Item>

          <Form.Item
            label="Repeat"
            field="repeat"
            rules={[
              { required: true },
              {
                validator: (v, cb) => {
                  if (signupForm.getFieldValue('password') !== v) {
                    return cb('Passwords do not match');
                  }
                  cb(null);
                },
              },
            ]}
          >
            <Input type="password" placeholder="repeat"></Input>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" onClick={onSignup}>
              Sign up
            </Button>
            <Divider type="vertical"></Divider>
            <Button loading={isSubmitting} onClick={() => setIsSignup(false)}>
              Back
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
