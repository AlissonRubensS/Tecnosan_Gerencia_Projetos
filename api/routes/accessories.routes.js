import { Router } from "express";
import { 
  createAccessory, 
  listAccessories, 
  updateAccessory, 
  deleteAccessory, 
  loanToProject, 
  loanToBudget, 
  returnAccessory, 
  listActiveLoans 
} from "../controllers/accessories.controller.js";

const router = Router();

// ==================================================================
// ROTAS ESPECÍFICAS (DEVEM VIR PRIMEIRO)
// ==================================================================

// 1. Empréstimos e Devoluções
router.get("/loans/active", listActiveLoans);
router.post("/loan/project", loanToProject);
router.post("/loan/budget", loanToBudget);
router.put("/return", returnAccessory); 
router.get("/", listAccessories);
router.post("/", createAccessory);

router.put("/:id", updateAccessory); 

router.delete("/:id", deleteAccessory);

export default router;