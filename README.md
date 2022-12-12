


# Course Registration System - PittCourse

## Introduction

The team consisted of Yiming Zeng (yiz182), Qisheng Ye (qiy48), Xinge(Charlotte) Wang (xiw178), and Mingtao Chen (mic148). The project is a course registration system made for both students and teachers and the admin. The frontend of the application is built with React and uses the arco-design library for the UI styling. The backend of the system is built with Express.

## Objective

The goal of the project was to develop a functional course registration system that could be used by students and teachers to manage courses and course registrations, and it could also be utilized by the admin to manage students, teachers and courses. Besides, the system includes features such as course prerequisites management, course capacity management, time conflict detection, and course grading.

We also implemented user authentication using the passport.js library. The application allows users to authenticate using their GitHub account or using the plain username/password scheme.

## Features

PittCourse includes the following features:

- User authentication: Students and teachers can sign up for accounts using their student/teacher ID and password. They can also link their GitHub account after signing up.

- Course management: Students can view course listings, register for courses, drop courses and view their course schedule. Teachers can view and edit their course listings and manage their course grades. The admin can add, edit, and delete courses.

- Course prerequisites management: The system allows for the specification of course prerequisites, and students can only register for courses if they have satisfied the prerequisites.

- Course capacity management: The system tracks the number of students enrolled in each course, and students can only register for a course if it has available capacity.

- Time conflict detection: The system checks for time conflicts when students register for courses and alerts the student if they are trying to register for a course that conflicts with another course in their schedule.

- Course grading: Teachers can view and manage their course grades, and students can view their grades for each course.

## Team member’s contributions

- Mingtao Chen (mic148) was responsible for implementing the authentication and permissions logic on both frontend and backend, setting up the frontend development framework, the home pages for all three types of users, and the accounts/courses management pages in the admin frontend. He also implemented some backend validation logic in the system, e.g. checking course time conflict, prerequisites, and capacity when students are registering for a course.

- Qisheng Ye (qiy48) was responsible for the front end of student users, which consists of course list and enrollment. Students could register for courses on the course list page and drop courses at the enrollment page. Through the backend API `/havechosen` and `/couldchose`, he implemented two views of student users. He also utilized ‘register_course' and ‘drop_course' to realize the real-time update of the corresponding list of students' course selections.

- Xinge(Charlotte) Wang(xiw178) was responsible for implementing the course_students component, in which teachers are responsible for managing the courses they are assigned to, including adding and removing students from their courses, and entering and updating student grades.

- Yiming Zeng(yiz182) was responsible for implementing the server side. He defined 4 Mongoose schemes: account, user, student, teacher, and course, and connected them together by reference. He also writes backend logic code, like Account information CRUD, Teacher information CRUD, Student information CRUD and Selection information CRUD. Except for these general functions, Yiming implemented some specific features like modify scores of students, retrive the course which can be chosen or cannot be chosen and so on. 

## Technical Architecture

The application uses the Express framework for handling HTTP requests and responses, and the Mongoose library for connecting to the MongoDB database. The frontend of the application is built with React and uses the arco-design library for the user interface. The application follows the MVC (Model-View-Controller) architectural pattern, with the Express routes serving as the controllers and the Mongoose models serving as the model. Since the frontend is a React SPA, the view layer is separated from the server and all data in the UI are loaded with AJAX requests.

### Account Management

In our system design, we separated the login information from the account information, this is because only known students and teachers can sign up for accounts. To create a user, the admin must first add the student/teacher information and inform the user of their student/teacher ID, the user then uses the ID as the username to sign up for accounts. Passwords in the system are combined with a random salt and hashed with the pbkdf2 algorithm before being stored in the database. 

The system also allows students and teachers to link their accounts to GitHub. After linking they can use their GitHub account to sign in. This is implemented by storing users’ GitHub ID when they link their accounts and using their ID to query associated accounts when users login.

### Authentication & Permissions

The app uses passport.js to implement the authentication, after a user login with their password or GitHub, the system will set a cookie indicating the identity of the user. The server will use the cookie to get the user’s information in subsequent requests.

Permission control in the system is implemented by looking up the request API’s permission from a static table (module/permissions.js), and comparing the result with the user’s role (student, teacher, and admin). Users without correct permissions will get a 401 error code.

Admin in the system can manage student, teacher, and their account information. Admin can also manage the basic information of all courses. Teachers can view their course calendar, edit the information of courses taught by them, edit students’ grading and withdraw students from their courses. Students can view their course calendar, enroll in available courses, and drop out from courses that still allow dropping.

### Course Management

Courses in the system contain information about course names, teacher, time, capacity, and prerequisites. A course can contain multiple sections, for example, a course can meet both on Tuesday and Thursday. A course can also have prerequisites in the form of course IDs, and students will have to finish all the prerequisites before they can register for a course. Multiple courses can have the same course ID, because they may be taught by different instructors or they meet on different days. 

### Course Selection management

Students’ course enrollment information is stored in a selection table, each record contains the reference to the student and course, the grade of the student if they finish the course, and a status marking whether the student is currently enrolled, have completed, have failed, or have withdrawn from the course.

## Challenges

* Setting up the dependencies. In some circumstances, the dependencies work differently in some operating systems and different node.js versions, which may cause different behaviors in different group members’ devices.
* Dealing with asynchronous code when working with the MongoDB database. We had to use async/await and Promises to make sure that our queries were executed in the correct order.
* Managing state: React and Express are designed to handle different aspects of web application development and use different state management approaches. This can make it difficult to keep the application state consistent and synchronized between the frontend and backend.
* Routing and URL management: React uses a declarative approach to routing, where the application's routes are defined as components. This can be difficult to integrate with Express, which uses a more traditional, imperative approach to routing.
* Authentication: Login methods using GitHub and username/password are very different even with passport-js, we had to figure out a way to combine different login methods, and allow the same user to login with multiple methods.
* Permissions: For better security of our system we had to implement robust permission control on both frontend and backend, so users with incorrect permissions won’t be able to access or modify resources.
* Error handling: React and Express have different mechanisms for handling errors, and it can be challenging to ensure that errors are handled consistently and gracefully across the entire application.
* Studying new libraries: In addition, we had to spend some time learning React and the arco-design library to build the frontend of the application.

## Future Work



* Adding more validation checks, such as checking for duplicate course selections
* Adding options for teachers to override the prerequisites for specific students
* Sync course schedule to third-party apps like Google Calendar
* Adding more third-party OAuth integrations in addition to GitHub, like Google, Microsoft, and Facebook.
* Conduct surveys or other research to gather feedback from students, faculty, and other stakeholders on the course selection process and use this information to make improvements.
* Developing algorithms that can assist with balancing the interests of students and faculty in the course selection process. 
* Requirements for degree and suggestions to students on what would be the best order to complete their degree requirements. 
* Course planner, which is like a shopping cart that the users can use to store some courses they want to take but are not taking right now.
* Optimize database query performance, e.g. reduce the number of queries for fetching the number of students enrolled in a course.
* Support better user experience for teachers, e.g. allowing teachers to grade students in bulk by uploading a csv/excel file.
* Integrate with third party payment service to collect tuition fees.

## Conclusion 

In this project, we learned about building APIs with the Express framework and connecting to a MongoDB database using Mongoose. We also learned about using the passport.js library for user authentication and building the frontend of the application with React and the arco-design library. We also learned OAuth authentication, which is to enable third-party applications to authorize users to access resource interfaces in the open platform without obtaining user sensitive information. Through the second assignment, we had preliminary contact with various frameworks and their advantages and disadvantages. These are very practical technologies in web development, which are also the technologies I want to learn.

For the iterations of courses, JavaScript, Express framework, REST APIs, CRUD and MongoDB are excellent content. We think that these technologies and standards will be useful in future iterations of this course, as they are widely used in the industry for building web applications.

## Resources

- Express: https://expressjs.com/

- Mongoose: https://mongoosejs.com/

- passport.js: http://www.passportjs.org/

- React: https://reactjs.org/

- arco-design: https://arco.design/react/en-US/docs/start

- React Router: https://reactrouter.com/en/main

## Testing instructions



1. Add Student/Teacher using admin account
2. Signup with the Student/Teacher ID
3. Add course using teacher account
4. Enroll/Drop courses using student account
5. View calender in teacher/student account

Test Account: 

| Type    | Username | Password    |
| ------- | -------- | ----------- |
| Admin   | admin    | admin_token |
| Student | mic148   | 12345       |
| Teacher | 1202     | 12345       |
| Student | 19120005 | zangshulei  |
| Teacher | 1203     | karimi      |
| Student | 12390901 | 12390901    |
| Teacher | 1204     | 1204        |
| Teacher | 1205     | 12345       |

