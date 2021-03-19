import {Router} from "express";
import { AddressController } from "./controllers/AddressController";
import { CustomerController } from "./controllers/CustomerController";
import { NeighborhoodController } from "./controllers/NeighborhoodController";
import UserController from "./controllers/UserController";


const router = Router();
const userController = new UserController(); 
const neighborhoodController = new NeighborhoodController();
const addressController = new AddressController();
const customerController = new CustomerController();

router.post("/users/",userController.create);
router.get("/users/",userController.list);
router.get("/users/:username",userController.getUserByUsername);
router.post("/login",userController.authenticateUser);

router.post("/neighborhoods/",neighborhoodController.create);

router.post("/addresses/",addressController.create);

router.post("/customer/",customerController.create);



export { router };