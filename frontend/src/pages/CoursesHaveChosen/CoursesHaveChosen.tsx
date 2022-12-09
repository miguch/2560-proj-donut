import { Button, List, Popconfirm, Table } from '@arco-design/web-react';
import Title from '@arco-design/web-react/es/Typography/title';
import { IconUserAdd } from '@arco-design/web-react/icon';
import { useEffect, useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import {
  PageActions,
  PageContainer,
  PageTableContainer,
  PageTitle,
} from '../pages.style';


export default function CoursesHaveChosen() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const columns = useMemo(
    () => [
      {
        key: 'course_id',
        title: 'Course ID',
        dataIndex: 'course_id',
      },
      {
        key: 'course_name',
        title: 'Name',
        dataIndex: 'course_name',
      },
      {
        key: 'credit',
        title: 'Credit',
        dataIndex: 'credit',
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
      },
      {
        key: 'teacher_id',
        title: 'Teacher',
        dataIndex: 'teacher_id',
        render: (_: Number, record: Coursehavechosen) => (
          <>{`${(record.teacher_id as Teacher).teacher_name} (${
            (record.teacher_id as Teacher).teacher_id
          })`}</>
        ),
      },
      // {
      //   key: 'student_id',
      //   title: 'Student',
      //   dataIndex: 'student_id',
      //   render: (_: Number, record: Coursehavechosen) => (
      //     <>{`${(record.student_id as Student).student_name} (${
      //       (record.student_id as Student).student_id
      //     })`}</>
      //   ),
      // },
      {
        key: 'grade',
        title: 'Grade',
        dataIndex: 'grade',
      },
      {
        key: 'gpa',
        title: 'Gpa',
        dataIndex: 'gpa',
      },
      {
        key: 'action',
        title: 'Action',
        render: (_: Number, item: Coursehavechosen) => (
          <Popconfirm
            title="Ready to drop this course?"
            onOk={async () => {
              setLoadingId(item._id as string)
              try {
                await fetcher('/api/drop_course', {
                  method: 'POST',
                  body: JSON.stringify({
                    selection_ref_id: item.selection_ref_id,
                    course_ref_id: item._id,
                  }),
                });
                load();
              } finally {
                setLoadingId(null);
              }
            }}
            okText="Yes"
          >
            <Button loading={item._id === loadingId} type="primary" status="success">
              Drop
            </Button>
          </Popconfirm>
        ),
      },
    ],
    []
  );

  const fetcher = useFetch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function load() {
    setIsLoading(true);
    try {
      const loaded = await fetcher('/api/havechosen');
      setData(loaded);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const [editItem, setEditItem] = useState<Coursehavechosen | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  return (
    <PageContainer>
      <PageTableContainer>
        <Table
          rowKey={(item: any) => item._id}
          columns={columns}
          data={data}
          loading={isLoading}
        ></Table>
      </PageTableContainer>
    </PageContainer>
  );
}

