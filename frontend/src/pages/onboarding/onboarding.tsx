import { Button, Form, Input } from '@arco-design/web-react';
import useForm from '@arco-design/web-react/es/Form/useForm';
import { useState } from 'react';
import useUser from '../../hooks/useUser';
import { OnboardingContainer } from './onboarding.style';

export default function Onboarding() {
  const [onboardForm] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, error, isLoading } = useUser();

  if (!user) {
    return <></>;
  }

  function onSubmit() {}

  return (
    <OnboardingContainer>
      <h3>Sign up with GitHub</h3>
      <Form
        form={onboardForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Form.Item
          label="Username"
          field="username"
          rules={[{ required: true }]}
        >
          <Input placeholder="username"></Input>
        </Form.Item>

        <Form.Item label="Email" field="email" rules={[{ required: true }]}>
          <Input placeholder="email"></Input>
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
                if (onboardForm.getFieldValue('password') !== v) {
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
          <Button
            htmlType="submit"
            loading={isSubmitting}
            type="primary"
            onClick={onSubmit}
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </OnboardingContainer>
  );
}
