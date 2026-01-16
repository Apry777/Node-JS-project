import express from 'express';
import userRouter from '../routes/user/userRouter.js';
import courseRouter from '../routes/course/coursesRouter.js';
import refreshRouter from './refreshAndLogout/refreshLogoutRouter.js';


const routes = express.Router();

routes.use('/users', userRouter);
routes.use('/courses', courseRouter);
routes.use('/', refreshRouter);

export default routes;