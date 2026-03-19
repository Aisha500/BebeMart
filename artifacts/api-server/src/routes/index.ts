import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import listingsRouter from "./listings";
import transactionsRouter from "./transactions";
import messagesRouter from "./messages";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/listings", listingsRouter);
router.use("/transactions", transactionsRouter);
router.use("/messages", messagesRouter);
router.use("/reviews", reviewsRouter);

export default router;
