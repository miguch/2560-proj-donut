import { Button, List, Popconfirm, Radio, Table } from '@arco-design/web-react';
import Title from '@arco-design/web-react/es/Typography/title';
import { IconUserAdd } from '@arco-design/web-react/icon';
import { useEffect, useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { valToTime, weekdays } from '../Courses/utils';
import {
  ColumnHideOnNarrow,
  PageActions,
  PageContainer,
  PageTableContainer,
  PageTitle,
  TableExpandedContainer,
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
        className: ColumnHideOnNarrow,
      },
      {
        key: 'credit',
        title: 'Credit',
        dataIndex: 'credit',
        className: ColumnHideOnNarrow,
      },
      {
        key: 'teacher_id',
        title: 'Teacher',
        dataIndex: 'teacher_id',
        className: ColumnHideOnNarrow,
        render: (_: Number, record: Coursehavechosen) => (
          <>{`${(record.teacher_id as Teacher).teacher_name} (${
            (record.teacher_id as Teacher).teacher_id
          })`}</>
        ),
      },
      {
        key: 'Status',
        title: 'Status',
        dataIndex: 'status',
      },
      {
        key: 'grade',
        title: 'Grade',
        dataIndex: 'grade',
      },
      {
        key: 'action',
        title: 'Action',
        render: (_: Number, item: Coursehavechosen) => (
          <Popconfirm
            title="Ready to ditch this class?"
            disabled={item.status !== 'enrolled'}
            onOk={async () => {
              setLoadingId(item._id as string);
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
            <Button
              disabled={item.status !== 'enrolled'}
              type="primary"
              status="warning"
            >
              Drop
            </Button>
          </Popconfirm>
        ),
      },
    ],
    []
  );

  const fetcher = useFetch();
  const [data, setData] = useState<Coursehavechosen[]>([]);
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

  const filterMap = {
    all: ['enrolled', 'completed', 'failed', 'withdrawn'],
    current: ['enrolled'],
    past: ['completed', 'failed', 'withdrawn'],
  };

  const [statusFilter, setStatusFilter] = useState<'all' | 'current' | 'past'>(
    'all'
  );

  const [editItem, setEditItem] = useState<Coursehavechosen | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  return (
    <PageContainer>
      <PageTitle>
        <Title heading={3} style={{ margin: 0 }}>
          Registered Courses
        </Title>
        <PageActions>
          <Radio.Group
            value={statusFilter}
            type="button"
            options={[
              {
                label: 'All',
                value: 'all',
              },
              {
                label: 'Current',
                value: 'current',
              },
              {
                label: 'Past',
                value: 'past',
              },
            ]}
            onChange={(v) => setStatusFilter(v)}
          ></Radio.Group>
        </PageActions>
      </PageTitle>
      <PageTableContainer>
        <Table
          rowKey={(item: Coursehavechosen) => item.selection_ref_id}
          columns={columns}
          data={data.filter((e) => filterMap[statusFilter].includes(e.status))}
          loading={isLoading}
          expandedRowRender={(record) => (
            <TableExpandedContainer>
              <div>
                <div>
                  <>Credit: {record.credit}</>
                </div>
                <div>
                  <>Department: {record.department}</>
                </div>
                <div>
                  <>Enrolled: {record.enrolledCount}</>
                </div>
                <div>
                  <>
                    Capacity:{' '}
                    {typeof record.capacity !== 'undefined'
                      ? record.capacity
                      : 'N/A'}
                  </>
                </div>
                <div>
                  <>Lecturer: {(record.teacher_id as Teacher).teacher_name}</>
                </div>
              </div>
              <List
                header="Course Sections"
                dataSource={record.sections.map(
                  (s) =>
                    `${weekdays[s.weekday]} ${valToTime(
                      s.startTime
                    )}-${valToTime(s.endTime)}`
                )}
                render={(item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                )}
              ></List>
              {record.prerequisites && record.prerequisites.length > 0 && (
                <List
                  header="Course Prerequisites"
                  dataSource={record.prerequisites}
                  render={(item, index) => (
                    <List.Item key={index}>{item}</List.Item>
                  )}
                ></List>
              )}
            </TableExpandedContainer>
          )}
        ></Table>
      </PageTableContainer>
    </PageContainer>
  );
}
