# Interview Scheduler

This is a React-based single-page application (SPA) for users to create, edit and delete interview appointments in real-time.

It can:

1. Book interviews with selected time and interviewers.
2. Edit the details of an exiting interview.
3. Cancel an exiting interview.
4. Show and update how many slots are available for each day. 
5. present a confirmation when users attempt to cancel an interview.
6. show a status indicator while asynchronous operations are in progress.
7. Show error message if request to the API is declined.
8. makes API requests to load and persist data. We do not lose data after a browser refresh.
9. Upadate client side data in real-time using web socket.

## Getting Started

1. Clone this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm start` command.
4. Clone the scheduler-api repository. [Click here to link to scheduler-api](https://github.com/SophiaL1024/scheduler-api).
5. Follow its README.md to set up the api.
6. Go to http://localhost:8000/ in your browser.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
 ## Screenshots
 *** Create an interview
!["Screenshots of Interview-Scheduler"](https://github.com/SophiaL1024/Interview-Scheduler/blob/master/doc/Create_Interview.png?raw=true)
 *** Show interviews
!["Screenshots of Interview-Scheduler"](https://github.com/SophiaL1024/Interview-Scheduler/blob/master/doc/Show_Interview.png?raw=true)
 *** Delete an interview
!["Screenshots of Interview-Scheduler"](https://github.com/SophiaL1024/Interview-Scheduler/blob/master/doc/Delete_Appointment.png?raw=true)

