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
import TeacherForm from './TeacherForm';

export default function Teachers() {
  const columns = useMemo(
    () => [
      {
        key: 'teacher_id',
        title: 'Teacher ID',
        dataIndex: 'teacher_id',
      },
      {
        key: 'teacher_name',
        title: 'Name',
        dataIndex: 'teacher_name',
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
      },
      {
        key: 'position',
        title: 'Position',
        dataIndex: 'position',
      },
      {
        key: 'action',
        title: 'Action',
        render: (_: Number, item: Teacher) => (
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
      const loaded = await fetcher('/api/teacher');
      setData(loaded);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const [editItem, setEditItem] = useState<Teacher | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  return (
    <PageContainer>
      <PageTitle>
        <Title heading={3} style={{ margin: 0 }}>
          Teachers
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

      <TeacherForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          load();
        }}
        editItem={editItem}
      ></TeacherForm>
    </PageContainer>
  );
}
