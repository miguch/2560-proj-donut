import { Button, Popconfirm, Table } from '@arco-design/web-react';
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

export default function Accounts() {
  const columns = useMemo(
    () => [
      {
        key: 'type',
        title: 'Type',
        dataIndex: 'type',
      },
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'ref_id',
      },
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
      },
      {
        key: 'github',
        title: 'GitHub',
        dataIndex: 'department',
        render: (_: Number, record: Account) => (
          <>{record.is_github_linked && '✅️ Linked'}</>
        ),
      },
      {
        key: 'action',
        title: 'Action',
        render: (_: Number, item: Account) => (
          <Popconfirm
            title="Are you sure you want to reset this account? The user will have to sign up again"
            onConfirm={async () => {
              await fetcher('/api/account', {
                method: 'DELETE',
                body: JSON.stringify({
                  _id: item._id,
                  type: item.type,
                }),
              });
              load();
            }}
          >
            <Button status="danger" type="primary">
              Reset
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
      const loaded = await fetcher('/api/account');
      setData(loaded);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <PageContainer>
      <PageTitle>
        <Title heading={3} style={{ margin: 0 }}>
          Accounts
        </Title>
        <PageActions></PageActions>
      </PageTitle>

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
