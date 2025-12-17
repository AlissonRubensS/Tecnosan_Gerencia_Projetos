import { Router } from "express";
import {
  getComponentStatus,
  getComponents,
} from "../controllers/components.controller.js";

const router = Router();

router.get("/status", getComponentStatus);
router.get("/", getComponents);

export default router;
