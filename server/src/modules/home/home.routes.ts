import { Router } from "express";
import { getHomeData } from "./home.controller";

const router = Router();

router.get("/home", getHomeData);

export default router;
