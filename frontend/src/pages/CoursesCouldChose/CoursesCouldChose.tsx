import { Button, List, Table } from '@arco-design/web-react';
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
        className: ColumnHideOnNarrow
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
        className: ColumnHideOnNarrow
      },
      {
        key: 'teacher_id',
        title: 'Teacher',
        dataIndex: 'teacher_id',
        className: ColumnHideOnNarrow,
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
                // setEditItem(item);
                // setFormVisible(true);
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

  return (
    <PageContainer>
      <PageTableContainer>
        <Table
          rowKey={(item: any) => item._id}
          columns={columns}
          data={data}
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
