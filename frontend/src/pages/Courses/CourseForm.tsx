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
import useUser from '../../hooks/useUser';

interface CourseFormProps {
  editItem: Course | null;
  visible: boolean;
  onClose: () => void;
}
export default function CourseForm({
  editItem,
  visible,
  onClose,
}: CourseFormProps) {
  const [form] = useForm();

  useEffect(() => {
    if (editItem) {
      for (const field in editItem) {
        form.setFieldValue(field, (editItem as any)[field]);
      }
      form.setFieldValue(
        'teacher_ref_id',
        (editItem.teacher_id as Teacher)._id
      );
    } else {
      form.resetFields();
      if (user?.type === 'teacher') {
        form.setFieldValue('teacher_ref_id', user._id);
        form.setFieldValue("department", user.department);
      }
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
        const data = await fetcher('/api/course', {
          method: 'PUT',
          body: JSON.stringify({
            _id: editItem._id,
            ...formValues,
            teacher_id: formValues.teacher_ref_id,
          }),
        });
      } else {
        // create
        const data = await fetcher('/api/course', {
          method: 'POST',
          body: JSON.stringify({
            ...formValues,
            teacher_id: formValues.teacher_ref_id,
          }),
        });
      }
      onClose();
    } catch (e) {
      console.log('form incomplete');
    } finally {
      setIsLoading(false);
    }
  }

  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user?.type === 'admin') {
      async function fetchOptions() {
        const data = await fetcher('/api/teacher');
        setTeacherList(data);
      }
      fetchOptions();
    }
  }, [user]);

  return (
    <Modal
      title="Course"
      visible={visible}
      onCancel={onClose}
      onOk={onSubmit}
      style={{ maxWidth: '80%' }}
    >
      <Form wrapperCol={{ span: 16 }} labelCol={{ span: 8 }} form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="Course ID"
          field="course_id"
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Name"
          field="course_name"
        >
          <Input></Input>
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="Credit" field="credit">
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Teacher"
          field="teacher_ref_id"
        >
          <Select
            onChange={(val) =>
              form.setFieldValue(
                'department',
                teacherList.find((e) => e._id === val)?.department
              )
            }
          >
            {user?.type === 'admin' &&
              teacherList.map((e) => (
                <Select.Option key={e._id as string} value={e._id as string}>
                  {e.teacher_name} ({e.teacher_id})
                </Select.Option>
              ))}
            {user?.type === 'teacher' && (
              <Select.Option value={user._id as string}>
                {user.teacher_name}
              </Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Department"
          field="department"
          disabled={true}
        >
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
