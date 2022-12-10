import { Button, Radio, Table } from '@arco-design/web-react';
import Title from '@arco-design/web-react/es/Typography/title';
import { IconUserAdd } from '@arco-design/web-react/icon';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'; //
import useFetch from '../../hooks/useFetch';
import {
  ColumnHideOnNarrow,
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
        className: ColumnHideOnNarrow,
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
      },
      // {
      //   key: 'action',
      //   title: 'Action',
      //   render: (_: Number, item: Student) => (
      //     <>
      //       <Button
      //         onClick={() => {
      //           setEditItem(item);
      //           setFormVisible(true);
      //         }}
      //       >
      //         Edit
      //       </Button>
      //     </>

      //   ),
      // },
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

  // const [editItem, setEditItem] = useState<Student | null>(null);
  // const [formVisible, setFormVisible] = useState<boolean>(false);

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

      {/* <CourseStudentForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          load();
        }}
        editItem={editItem}
      ></CourseStudentForm> */}
    </PageContainer>
  );
}
