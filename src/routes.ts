import {Router} from "express";
import UserController from "./controllers/UserController";


const router = Router();
const userController = new UserController(); 

router.post("/users/",userController.create);
router.get("/users/",userController.list);

export { router };