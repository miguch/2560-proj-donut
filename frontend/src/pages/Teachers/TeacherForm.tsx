import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from '@arco-design/web-react';
import useForm from '@arco-design/web-react/es/Form/useForm';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';

interface TeacherFormProps {
  editItem: Teacher | null;
  visible: boolean;
  onClose: () => void;
}
export default function TeacherForm({
  editItem,
  visible,
  onClose,
}: TeacherFormProps) {
  const [form] = useForm();

  useEffect(() => {
    if (editItem) {
      for (const field in editItem) {
        form.setFieldValue(field, (editItem as any)[field]);
      }
    } else {
      form.resetFields();
    }
  }, [editItem]);

  const fetcher = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit() {
    try {
      setIsLoading(true);
      const formValues = await form.validate();
      if (editItem) {
        // update
        const data = await fetcher('/api/teacher', {
          method: 'PUT',
          body: JSON.stringify({ _id: editItem._id, ...formValues }),
        });
      } else {
        // create
        const data = await fetcher('/api/teacher', {
          method: 'POST',
          body: JSON.stringify(formValues),
        });
      }
      onClose();
    } catch (e) {
      console.log('form incomplete');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Teacher"
      visible={visible}
      onCancel={onClose}
      onOk={onSubmit}
      style={{ maxWidth: '80%' }}
    >
      <Form wrapperCol={{ span: 16 }} labelCol={{ span: 8 }} form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="Teacher ID"
          field="teacher_id"
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Name"
          field="teacher_name"
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Department"
          field="department"
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Position"
          field="position"
        >
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
