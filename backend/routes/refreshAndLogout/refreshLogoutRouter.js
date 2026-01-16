import express from 'express';
import {refreshPage, logout} from '../../controller/refreshLogoutController.js';

const router = express.Router();

router.post('/refresh', refreshPage);
router.post('/logout', logout);

export default router;
