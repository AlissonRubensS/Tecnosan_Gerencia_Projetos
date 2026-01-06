import { Router } from "express";
import { addConsumptionLog } from "../controllers/components.materials.controller.js";

const router = Router();

router.post("/", addConsumptionLog);

export default router;
