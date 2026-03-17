import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolSettingsRouter from "./toolSettings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolSettingsRouter);

export default router;
