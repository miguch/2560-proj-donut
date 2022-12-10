import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Message,
  Modal,
  Select,
  Table,
  TimePicker,
  Tooltip,
} from '@arco-design/web-react';
import useForm from '@arco-design/web-react/es/Form/useForm';
import { IconQuestionCircle } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useUser from '../../hooks/useUser';
import { ModalTableContainer } from '../pages.style';
import { timeToVal, valToTime, weekdays } from './utils';

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
    form.resetFields();
    if (editItem) {
      for (const field in editItem) {
        form.setFieldValue(field, (editItem as any)[field]);
      }
      form.setFieldValue(
        'teacher_ref_id',
        (editItem.teacher_id as Teacher)._id
      );
      setSections(editItem.sections || []);
    } else {
      if (user?.type === 'teacher') {
        form.setFieldValue('teacher_ref_id', user._id);
        form.setFieldValue('department', user.department);
      }
      setSections([]);
    }
  }, [editItem]);

  const fetcher = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit() {
    if (sections.length === 0) {
      Message.warning('At least one section is needed');
      return;
    }
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
            sections,
          }),
        });
      } else {
        // create
        const data = await fetcher('/api/course', {
          method: 'POST',
          body: JSON.stringify({
            ...formValues,
            teacher_id: formValues.teacher_ref_id,
            sections,
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
  const [courseList, setCourseList] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      if (user?.type === 'admin') {
        const data = await fetcher('/api/teacher');
        setTeacherList(data);
      }
      const courseData = await fetcher('/api/course?showFull=true');
      setCourseList(
        courseData.filter(
          (item: Course, pos: number) =>
            courseData.findIndex(
              (e: Course) => e.course_id === item.course_id
            ) === pos
        )
      );
    }
    fetchOptions();
  }, [user]);

  const [sections, setSections] = useState<Section[]>([]);

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
        <Form.Item
          label="Capacity"
          field="capacity"
        >
          <InputNumber></InputNumber>
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
        <Form.Item
          rules={[{ required: true }]}
          label="Sections"
          initialValue={[]}
        >
          <ModalTableContainer>
            <Table
              data={sections}
              pagination={false}
              rowKey={(row) =>
                `${row.weekday} ${row.startTime} ${Math.random()}`
              }
              columns={[
                {
                  key: 'weekday',
                  title: 'Weekday',
                  dataIndex: 'weekday',
                  render(col, item, index) {
                    return (
                      <Select
                        onChange={(newVal) => {
                          sections[index].weekday = newVal;
                          setSections([...sections]);
                        }}
                        value={col}
                      >
                        {weekdays.map((dayName, idx) => (
                          <Select.Option key={idx} value={idx}>
                            {dayName}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  },
                },
                {
                  key: 'startTime',
                  title: 'Start Time',
                  dataIndex: 'startTime',
                  render(col, item, index) {
                    return (
                      <TimePicker
                        allowClear={false}
                        format="HH:mm"
                        value={valToTime(col)}
                        onChange={(str) => {
                          const val = timeToVal(str);
                          if (val > sections[index].endTime) {
                            Message.warning(
                              'Section cannot start after end time'
                            );
                            return;
                          }
                          sections[index].startTime = val;
                          setSections([...sections]);
                        }}
                      ></TimePicker>
                    );
                  },
                },
                {
                  key: 'endTime',
                  title: 'End Time',
                  dataIndex: 'endTime',
                  render(col, item, index) {
                    return (
                      <TimePicker
                        allowClear={false}
                        format="HH:mm"
                        value={valToTime(col)}
                        onChange={(str) => {
                          const val = timeToVal(str);
                          if (val < sections[index].startTime) {
                            Message.warning(
                              'Section cannot end before start time'
                            );
                            return;
                          }
                          sections[index].endTime = val;
                          setSections([...sections]);
                        }}
                      ></TimePicker>
                    );
                  },
                },
              ]}
            />
          </ModalTableContainer>
          <Button
            style={{ marginTop: '3px' }}
            onClick={() => {
              setSections([
                ...sections,
                {
                  weekday: 0,
                  startTime: 540,
                  endTime: 720,
                },
              ]);
            }}
          >
            Add
          </Button>
          <Button
            style={{ marginTop: '3px', marginLeft: '6px' }}
            status="danger"
            onClick={() => {
              if (sections.length > 0) {
                setSections(sections.slice(0, sections.length - 1));
              }
            }}
          >
            Remove
          </Button>
        </Form.Item>
        <Form.Item label="Prerequisites" field="prerequisites">
          <Select mode="multiple">
            {courseList.map((option, index) => (
              <Select.Option key={option.course_id} value={option.course_id}>
                {option.course_id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          triggerPropName="checked"
          label={
            <Tooltip content="If checked, this course won't be offered to students">
              Paused
              <IconQuestionCircle
                style={{
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                  color: 'var(--color-text-3)',
                }}
              ></IconQuestionCircle>
            </Tooltip>
          }
          field="isPaused"
        >
          <Checkbox></Checkbox>
        </Form.Item>
        <Form.Item
          triggerPropName="checked"
          label={
            <Tooltip content="If checked, this course won't accept new students and enrolled students won't be able to drop">
              Withdraw Only
              <IconQuestionCircle
                style={{
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                  color: 'var(--color-text-3)',
                }}
              ></IconQuestionCircle>
            </Tooltip>
          }
          field="withdrawOnly"
        >
          <Checkbox></Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
