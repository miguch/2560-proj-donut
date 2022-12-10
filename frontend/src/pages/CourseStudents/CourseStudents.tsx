import { Button, Table } from '@arco-design/web-react';
import Title from '@arco-design/web-react/es/Typography/title';
import { IconUserAdd } from '@arco-design/web-react/icon';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'; //
import useFetch from '../../hooks/useFetch';
import {
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
      const fetchData = async () => {
        const response = await fetcher(`/api/course_students`, {
          method: 'POST',
          body: JSON.stringify({
            course_ref_id: course_ref_id,
          }),
        });
        //const loaded = await fetcher('/api/course_student');
        setData(response);
      };
    } catch (error) {
      // Handle the error
      console.error(error);
      alert('An error occurred while fetching data from the API.');
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   const { course_ref_id } = useParams();
  //   const fetchData = async () => {
  //     const response = await fetch(`/api/courses/${course_ref_id}`);
  //     const data = await response.json();
  //     // Use the data to update state or render the component...
  //   };
  //   fetchData();
  // }, []);

  // const [editItem, setEditItem] = useState<Student | null>(null);
  // const [formVisible, setFormVisible] = useState<boolean>(false);

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
