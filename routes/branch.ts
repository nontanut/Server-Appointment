import { Router } from "express";
import { branches } from "../controllers/branch";

const router = Router();

router.get("/branches", branches);

export default router;
