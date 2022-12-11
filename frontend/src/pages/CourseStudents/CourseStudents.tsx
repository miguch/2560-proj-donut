import {
  Button,
  Message,
  Popconfirm,
  Radio,
  Table,
} from '@arco-design/web-react';
import Title from '@arco-design/web-react/es/Typography/title';
import { IconUserAdd } from '@arco-design/web-react/icon';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'; //
import useFetch from '../../hooks/useFetch';
import {
  ColumnHideOnNarrow,
  ColumnHideOnWidth,
  PageActions,
  PageContainer,
  PageTableContainer,
  PageTitle,
} from '../pages.style';
import CourseStudentForm from './CourseStudentForm';

export default function CourseStudents() {
  const columns = useMemo(
    () => [
      {
        key: 'student_id',
        title: 'Student ID',
        dataIndex: 'student_id',
        render: (_: undefined, item: CourseStudent) =>
          (item.student_id as Student).student_id,
      },
      {
        key: 'student_name',
        title: 'Name',
        dataIndex: 'student_name',
        render: (_: undefined, item: CourseStudent) =>
          (item.student_id as Student).student_name,
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
        render: (_: undefined, item: CourseStudent) =>
          (item.student_id as Student).department,
        className: ColumnHideOnWidth(1020),
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
      },
      {
        key: 'grade',
        title: 'Grade',
        dataIndex: 'grade',
      },
      {
        key: 'grading',
        title: 'Grading',
        render: (_: Number, item: CourseStudent) => (
          <Button
            status="success"
            disabled={item.status === 'withdrawn'}
            onClick={() => {
              setEditItem(item);
              setFormVisible(true);
            }}
          >
            Grade
          </Button>
        ),
      },
      {
        key: 'withdraw',
        title: 'Withdraw',
        render: (_: Number, item: CourseStudent) => (
          <Popconfirm
            title={`Are you sure?`}
            disabled={item.status !== 'enrolled'}
            onOk={async () => {
              try {
                await fetcher('/api/withdraw', {
                  method: 'POST',
                  body: JSON.stringify({
                    selection_ref_id: item._id,
                  }),
                });
                Message.success('Withdrew successfully');
                load();
              } catch (e) {}
            }}
          >
            <Button disabled={item.status !== 'enrolled'} status="warning">
              Withdraw
            </Button>
          </Popconfirm>
        ),
      },
    ],
    []
  );

  const fetcher = useFetch();
  const [data, setData] = useState<CourseStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { course_ref_id } = useParams();
  async function load() {
    setIsLoading(true);
    try {
      const response = await fetcher(`/api/course_students`, {
        method: 'POST',
        body: JSON.stringify({
          course_ref_id: course_ref_id,
        }),
      });
      //const loaded = await fetcher('/api/course_student');
      setData(response);
    } catch (error) {
      // Handle the error
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const [editItem, setEditItem] = useState<CourseStudent | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  const filterMap = {
    All: ['enrolled', 'completed', 'failed', 'withdrawn'],
    Enrolled: ['enrolled'],
    Ended: ['completed', 'failed', 'withdrawn'],
  };

  const [statusFilter, setStatusFilter] =
    useState<keyof typeof filterMap>('All');

  return (
    <PageContainer>
      <PageTitle>
        <Title heading={3} style={{ margin: 0 }}>
          Students
        </Title>
        <PageActions>
          <Radio.Group
            value={statusFilter}
            type="button"
            options={Object.keys(filterMap).map((e) => ({
              label: e,
              value: e,
            }))}
            onChange={(v) => setStatusFilter(v)}
          ></Radio.Group>
        </PageActions>
      </PageTitle>

      <PageTableContainer>
        <Table
          rowKey={(item: any) => item._id}
          columns={columns}
          data={data.filter((e) => filterMap[statusFilter].includes(e.status))}
          loading={isLoading}
        ></Table>
      </PageTableContainer>

      <CourseStudentForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          load();
        }}
        editItem={editItem}
      ></CourseStudentForm>
    </PageContainer>
  );
}
