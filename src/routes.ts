import { Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";
import { AddressController } from "./controllers/AddressController";
import { CustomerController } from "./controllers/CustomerController";
import DeliveryController from "./controllers/DeliveryController";
import { NeighborhoodController } from "./controllers/NeighborhoodController";
import UserController from "./controllers/UserController";
import UserTypeController from "./controllers/UserTypeController";
import { ensureAuthenticated } from "./middlewares/EnsureAuthenticated";

const router = Router();

const userController = new UserController();
const neighborhoodController = new NeighborhoodController();
const addressController = new AddressController();
const customerController = new CustomerController();
const userTypeController = new UserTypeController();
const deliveryController = new DeliveryController();

router.post("/users/", userController.create);
router.get("/users/", userController.list);
router.get("/users/:username", userController.getUserByUsername);

router.post("/login", userController.authenticateUser);

router.get("/neighborhoods/", neighborhoodController.list);

router.get("/addresses/", addressController.list);

router.post("/customers/", multer(multerConfig).single("photo"), customerController.create);
router.put("/customers/", multer(multerConfig).single("photo"), customerController.update);
router.put("/customers/user/usertype",ensureAuthenticated, customerController.changeUserTypeOfCustomer);
router.get("/customers/", customerController.list);
router.get("/customers/:id", customerController.findCustomerById);

router.get("/user-types", userTypeController.list);

router.post("/delivery", deliveryController.create);
router.put("/delivery", deliveryController.update);
router.get("/delivery/buyer/:idBuyer", deliveryController.listForBuyer);
router.get("/delivery/receiver/:idReceiver", deliveryController.listForReceiver);

export { router };
