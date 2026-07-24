import { Router } from "express";
import { globalSearch } from "./search.controller";

const router = Router();

router.get("/search", globalSearch);

export default router;
