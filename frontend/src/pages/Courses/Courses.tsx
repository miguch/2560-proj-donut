import { Button, List, Table, Typography } from '@arco-design/web-react';
import Title from '@arco-design/web-react/es/Typography/title';
import { IconUserAdd } from '@arco-design/web-react/icon';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useUser from '../../hooks/useUser';

import {
  ColumnHideOnNarrow,
  PageActions,
  PageContainer,
  PageTableContainer,
  PageTitle,
  TableExpandedContainer,
} from '../pages.style';
import CourseForm from './CourseForm';
import { valToTime, weekdays } from './utils';

export default function Courses() {
  const { user } = useUser();
  const navigate = useNavigate();
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
        className: ColumnHideOnNarrow,
      },
      {
        key: 'department',
        title: 'Department',
        dataIndex: 'department',
        className: ColumnHideOnNarrow,
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
        render: (_: Number, item: Course) => (
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
      ...(user && user.type === 'teacher'
        ? [
            {
              key: 'magage',
              title: 'Manage',
              render: (_: Number, item: Course) => (
                <>
                  <NavLink to={'/courses_students/' + item._id}>
                    <Button>Students</Button>
                  </NavLink>
                </>
              ),
            },
          ]
        : []),
    ],
    []
  );

  const fetcher = useFetch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function load() {
    setIsLoading(true);
    try {
      const loaded = await fetcher('/api/course');
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
      <PageTitle>
        <Title heading={3} style={{ margin: 0 }}>
          Courses
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
                  <>
                    Lecturer:
                    {`${(record.teacher_id as Teacher).teacher_name} (${
                      (record.teacher_id as Teacher).teacher_id
                    })`}
                  </>
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

      <CourseForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          load();
        }}
        editItem={editItem}
      ></CourseForm>
    </PageContainer>
  );
}
