import { Router } from "express";
import { checkBooking, create, data } from "../controllers/form";

const router = Router();

router.post("/create", create);
router.get("/data", data);
router.get("/check", checkBooking);

export default router;
