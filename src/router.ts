import { Router } from "express";
import { comissionsController } from "./Controllers/ComissionsController";

const router: Router = Router();

router.post("/api/calcula-comissao", comissionsController.calculateComissions);

export { router };
