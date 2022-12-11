import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Tooltip,
} from '@arco-design/web-react';
import useForm from '@arco-design/web-react/es/Form/useForm';
import { IconQuestionCircle } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';

interface CourseStudentFormProps {
  editItem: CourseStudent | null;
  visible: boolean;
  onClose: () => void;
}
export default function CourseStudentForm({
  editItem,
  visible,
  onClose,
}: CourseStudentFormProps) {
  const [form] = useForm();
  const [_, rerender] = useState({});

  useEffect(() => {
    if (editItem) {
      for (const field in editItem) {
        form.setFieldValue(field, (editItem as any)[field]);
      }
      rerender({});
    } else {
      form.resetFields();
    }
  }, [editItem]);

  const fetcher = useFetch();
  const [isLoading, setIsLoading] = useState(false);

  // edit items
  async function onSubmit() {
    try {
      setIsLoading(true);
      const formValues = await form.validate();
      if (editItem) {
        // update
        const data = await fetcher('/api/grade', {
          method: 'POST',
          body: JSON.stringify({
            selection_ref_id: editItem._id,
            grade: formValues.grade,
            completed: formValues.status === 'completed',
            failed: formValues.status === 'failed',
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

  if (!editItem) return <></>;

  return (
    <Modal
      title="Student"
      visible={visible}
      onCancel={onClose}
      onOk={onSubmit}
      style={{ maxWidth: '80%' }}
    >
      <Form wrapperCol={{ span: 16 }} labelCol={{ span: 8 }} form={form}>
        <Form.Item rules={[{ required: true }]} label="Student ID">
          <Input
            disabled={true}
            value={(editItem?.student_id as Student).student_id}
          ></Input>
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="StudentName">
          <Input
            disabled={true}
            value={(editItem?.student_id as Student).student_name}
          ></Input>
        </Form.Item>
        <Form.Item
          label={
            <Tooltip content='Grading will only be official if status is not marked as "Enrolled"'>
              Status <IconQuestionCircle />
            </Tooltip>
          }
          field="status"
          onChange={() => rerender({})}
        >
          <Radio.Group>
            <Radio value="enrolled">Enrolled</Radio>
            <Radio value="completed">Completed</Radio>
            <Radio value="failed">Failed</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: form.getFieldValue('status') === 'completed',
              message:
                'Grading is required if the student completes the course',
            },
          ]}
          label={
            <Tooltip content="Grading is required if the student completes the course">
              Grade <IconQuestionCircle />
            </Tooltip>
          }
          field="grade"
        >
          <InputNumber></InputNumber>
        </Form.Item>
      </Form>
    </Modal>
  );
}
