import { Router } from "express";
import {
  getComponentStatus,
} from "../controllers/components.controller.js";

const router = Router();

router.get("/status", getComponentStatus);

export default router;
