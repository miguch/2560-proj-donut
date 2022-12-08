import { Card, Grid, Tooltip, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import useUser from '../hooks/useUser';
import { valToTime, weekdays } from '../pages/Courses/utils';
import { HomeContainer, ScheduleItemClass } from './layout.style';

export default function Home() {
  const { user } = useUser();
  // return<></>

  const [courseList, setCourseList] = useState<Course[]>();
  const [selectionList, setSelectionList] = useState<Coursehavechosen[]>([]);
  const fetcher = useFetch();

  useEffect(() => {
    async function load() {
      const day = dayjs().day();
      if (user?.type === 'teacher') {
        const data = await fetcher('/api/course');
        setCourseList(
          data.filter(
            (e: Course) =>
              !e.isPaused &&
              e.sections.find((section) => section.weekday === day)
          )
        );
      } else if (user?.type === 'student') {
        const data = await fetcher('/api/havechosen');
        setSelectionList(
          data.filter(
            (e: Coursehavechosen) =>
              e.status === 'enrolled' &&
              e.sections.find((section) => section.weekday === day)
          )
        );
      }
    }
    load();
  }, [user]);

  if (!user || !user.type) {
    return <></>;
  }

  const render = {
    admin: (
      <>
        <Typography.Title heading={1}>Hey there!</Typography.Title>
        <Typography.Title heading={5}>
          {'Happy Administrating :)'}
        </Typography.Title>
      </>
    ),
    teacher: (
      <>
        <Typography.Title heading={1}>Hi {user.teacher_name}!</Typography.Title>
        <Card title={`Schedule (${weekdays[dayjs().day()]})`}>
          {courseList?.length === 0 ? (
            <>{'No course today, take a rest :)'}</>
          ) : (
            <Card bordered={false}>
              {courseList?.map((course) => (
                <Card.Grid
                  className={ScheduleItemClass}
                  key={course._id as string}
                >
                  <Card
                    title={
                      <Tooltip content={course.course_name}>
                        {course.course_id}
                      </Tooltip>
                    }
                  >
                    {course.sections
                      .filter((e) => e.weekday === dayjs().day())
                      .map((e, idx) => (
                        <div key={idx}>{`${valToTime(
                          e.startTime
                        )} - ${valToTime(e.endTime)}`}</div>
                      ))}
                  </Card>
                </Card.Grid>
              ))}
            </Card>
          )}
        </Card>
      </>
    ),
    student: (
      <>
        <Typography.Title heading={1}>Hi {user.student_name}!</Typography.Title>
        <Card title={`Schedule (${weekdays[dayjs().day()]})`}>
          {selectionList?.length === 0 ? (
            <>{'No course today, time to catch up on some homework🤪'}</>
          ) : (
            <Card bordered={false}>
              {selectionList?.map((course) => (
                <Card.Grid
                  className={ScheduleItemClass}
                  key={course.selection_ref_id as string}
                >
                  <Card
                    title={
                      <Tooltip content={course.course_name}>
                        {course.course_id}
                      </Tooltip>
                    }
                  >
                    {course.sections
                      .filter((e) => e.weekday === dayjs().day())
                      .map((e, idx) => (
                        <div key={idx}>{`${valToTime(
                          e.startTime
                        )} - ${valToTime(e.endTime)}`}</div>
                      ))}
                  </Card>
                </Card.Grid>
              ))}
            </Card>
          )}
        </Card>
      </>
    ),
  };

  return <HomeContainer>{render[user.type]}</HomeContainer>;
}
