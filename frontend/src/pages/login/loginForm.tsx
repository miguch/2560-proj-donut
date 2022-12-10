import {
  Button,
  Divider,
  Form,
  Input,
  Message,
  Select,
  Tooltip,
} from '@arco-design/web-react';
import useForm from '@arco-design/web-react/es/Form/useForm';

import { IconGithub, IconQuestionCircle } from '@arco-design/web-react/icon';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import useFetch from '../../hooks/useFetch';
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
  const [loginForm] = useForm();
  const navigate = useNavigate();
  const fetcher = useFetch(false);
  const { cache } = useSWRConfig();

  function onGitHubLogin() {
    window.location.href = '/api/auth/github' + location.search;
  }

  async function onLogin() {
    try {
      setIsSubmitting(true);
      let formValues;
      try {
        formValues = await loginForm.validate();
      } catch (e) {
        console.log('form incomplete');
        Message.warning('Please check if your info is complete');
        return;
      }

      const query = new URLSearchParams(location.search);
      const postData = {
        ...formValues,
      };
      const res = await fetcher('/api/auth/local', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      if (res.status != 200) {
        Message.error(res.message);
        return;
      }
      (cache as any).clear();
      navigate(query.has('r') ? (query.get('r') as string) : '/');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSignup() {
    try {
      setIsSubmitting(true);
      let formValues;
      try {
        formValues = await signupForm.validate();
      } catch (e) {
        console.log('form incomplete');
        Message.warning('Please check if your info is complete');
        return;
      }

      const query = new URLSearchParams(location.search);
      const postData = {
        ...formValues,
      };
      delete postData.repeat;
      const res = await fetcher('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      if (res.status != 200) {
        Message.error(res.message);
        return;
      }
      (cache as any).clear();
      navigate(query.has('r') ? (query.get('r') as string) : '/');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <LoginTitle>CourseNet</LoginTitle>
      <Button type="primary" onClick={onGitHubLogin} icon={<IconGithub />}>
        Sign In with GitHub
      </Button>
      <Divider></Divider>
      {!isSignup && (
        <Form
          form={loginForm}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="Type"
            field="identity"
            rules={[{ required: true }]}
            initialValue="student"
          >
            <Select placeholder="Type">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="teacher">Instructor</Select.Option>{' '}
              <Select.Option value="admin">Admin</Select.Option>
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
            label="Password"
            field="password"
            rules={[{ required: true }]}
          >
            <Input type="password" placeholder="password"></Input>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              htmlType="submit"
              loading={isSubmitting}
              type="primary"
              onClick={onLogin}
            >
              Login
            </Button>
            <Divider type="vertical"></Divider>
            <Button onClick={() => setIsSignup(true)}>Signup</Button>
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
            field="identity"
            rules={[{ required: true }]}
            initialValue="student"
          >
            <Select placeholder="Type">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="teacher">Instructor</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <Tooltip
                mini
                content="Contact your admin if you don't know your username"
              >
                Username
                <IconQuestionCircle
                  style={{
                    verticalAlign: 'middle',
                    marginLeft: '2px',
                    color: 'var(--color-text-3)',
                  }}
                ></IconQuestionCircle>
              </Tooltip>
            }
            field="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="username"></Input>
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
            <Button loading={isSubmitting} type="primary" onClick={onSignup}>
              Sign up
            </Button>
            <Divider type="vertical"></Divider>
            <Button onClick={() => setIsSignup(false)}>Back</Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
