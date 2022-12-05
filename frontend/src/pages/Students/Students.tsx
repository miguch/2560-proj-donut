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
import StudentForm from './StudentForm';

export default function Students() {
  const columns = useMemo(
    () => [
      {
        key: 'student_id',
        title: 'Student ID',
        dataIndex: 'student_id',
      },
      {
        key: 'student_name',
        title: 'Name',
        dataIndex: 'student_name',
      },
      {
        key: 'gender',
        title: 'Gender',
        dataIndex: 'gender',
      },
      {
        key: 'age',
        title: 'Age',
        dataIndex: 'age',
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
      },
      {
        key: 'fee',
        title: 'Fee',
        dataIndex: 'fee',
      },
      {
        key: 'action',
        title: 'Action',
        render: (_: Number, item: Student) => (
          <>
            <Button
              onClick={() => {
                setEditItem(item);
                setFormVisible(true);
              }}
            >
              Edit
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
      const loaded = await fetcher('/api/student');
      setData(loaded);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const [editItem, setEditItem] = useState<Student | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  return (
    <PageContainer>
      <PageTitle>
        <Title heading={3} style={{ margin: 0 }}>
          Students
        </Title>
        <PageActions>
          <Button
            icon={<IconUserAdd />}
            onClick={() => {
              setEditItem(null);
              setFormVisible(true);
            }}
          >
            New
          </Button>
        </PageActions>
      </PageTitle>

      <PageTableContainer>
        <Table
          rowKey={(item: any) => item._id}
          columns={columns}
          data={data}
          loading={isLoading}
        ></Table>
      </PageTableContainer>

      <StudentForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          load();
        }}
        editItem={editItem}
      ></StudentForm>
    </PageContainer>
  );
}
