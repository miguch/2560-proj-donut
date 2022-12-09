import { Card, Grid, Tooltip, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import useUser from '../hooks/useUser';
import { valToTime, weekdays } from '../pages/Courses/utils';
import { CalendarCard, HomeContainer, ScheduleItemClass } from './layout.style';

export default function Home() {
  const { user } = useUser();
  // return<></>

  const [courseList, setCourseList] = useState<Course[][]>([]);
  const [selectionList, setSelectionList] = useState<Coursehavechosen[][]>([]);
  const fetcher = useFetch();
  const currentDay = dayjs().day();

  useEffect(() => {
    async function load() {
      if (user?.type === 'teacher') {
        const data = await fetcher('/api/course');
        setCourseList(
          [...new Array(7)].map((_, idx) =>
            data.filter(
              (e: Course) =>
                !e.isPaused &&
                e.sections.find((section) => section.weekday === idx)
            )
          )
        );
      } else if (user?.type === 'student') {
        const data = await fetcher('/api/havechosen');
        setSelectionList(
          [...new Array(7)].map((_, idx) =>
            data.filter(
              (e: Coursehavechosen) =>
                e.status === 'enrolled' &&
                e.sections.find((section) => section.weekday === idx)
            )
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
        <Card title={`Schedule (${weekdays[currentDay]})`}>
          {courseList[currentDay]?.length === 0 ? (
            <>{'No course today, take a rest :)'}</>
          ) : (
            <Card bordered={false}>
              {courseList[currentDay]?.map((course) => (
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
                      .filter((e) => e.weekday === currentDay)
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

        <Card bordered={false} style={{ marginTop: '16px' }} title="Calendar">
          {weekdays.map((dayName, idx) => (
            <Card.Grid className={CalendarCard} key={idx}>
              <Card
                bodyStyle={{ padding: '8px', minHeight: '48px' }}
                bordered={false}
                title={dayName}
              >
                {courseList[idx]?.map((course) => (
                  <Card
                    title={
                      <Tooltip content={course.course_name}>
                        {course.course_id}
                      </Tooltip>
                    }
                    style={{ marginBottom: '6px' }}
                    key={course._id as string}
                  >
                    {course.sections
                      .filter((e) => e.weekday === idx)
                      .map((e, idx) => (
                        <div key={idx}>{`${valToTime(
                          e.startTime
                        )} - ${valToTime(e.endTime)}`}</div>
                      ))}
                  </Card>
                ))}
              </Card>
            </Card.Grid>
          ))}
        </Card>
      </>
    ),
    student: (
      <>
        <Typography.Title heading={1}>Hi {user.student_name}!</Typography.Title>
        <Card title={`Schedule (${weekdays[currentDay]})`}>
          {selectionList[currentDay]?.length === 0 ? (
            <>{'No course today, time to catch up on some homework🤪'}</>
          ) : (
            <Card bordered={false}>
              {selectionList[currentDay]?.map((course) => (
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
                      .filter((e) => e.weekday === currentDay)
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

        <Card bordered={false} style={{ marginTop: '16px' }} title="Calendar">
          {weekdays.map((dayName, idx) => (
            <Card.Grid className={CalendarCard} key={idx}>
              <Card
                bodyStyle={{ padding: '8px', minHeight: '48px' }}
                bordered={false}
                title={dayName}
              >
                {selectionList[idx]?.map((course) => (
                  <Card
                    title={
                      <Tooltip content={course.course_name}>
                        {course.course_id}
                      </Tooltip>
                    }
                    style={{ marginBottom: '6px' }}
                    key={course._id as string}
                  >
                    {course.sections
                      .filter((e) => e.weekday === idx)
                      .map((e, idx) => (
                        <div key={idx}>{`${valToTime(
                          e.startTime
                        )} - ${valToTime(e.endTime)}`}</div>
                      ))}
                  </Card>
                ))}
              </Card>
            </Card.Grid>
          ))}
        </Card>
      </>
    ),
  };

  return <HomeContainer>{render[user.type]}</HomeContainer>;
}
