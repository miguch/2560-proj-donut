import { Button, Table } from '@arco-design/web-react';
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


export default function CoursesCouldChose() {
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
        render: (_: Number, record: Course) => (
          <>{`${(record.teacher_id as Teacher).teacher_name} (${
            (record.teacher_id as Teacher).teacher_id
          })`}</>
        ),
      },
      {
        key: 'action',
        title: 'Action',
        //_id
        render: (_: Number, item: Course) => (
          <>
            <Button
              onClick={() => {
                setEditItem(item);
                setFormVisible(true);
              }}
            >
              Enroll
            </Button>
          </>
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
      const loaded = await fetcher('/api/couldchose');
      setData(loaded);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const [editItem, setEditItem] = useState<Course | null>(null);
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

