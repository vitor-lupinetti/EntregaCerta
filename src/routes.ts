import { NextFunction, Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";
import { AddressController } from "./controllers/AddressController";
import { CustomerController } from "./controllers/CustomerController";
import DeliveryController from "./controllers/DeliveryController";
import { NeighborhoodController } from "./controllers/NeighborhoodController";
import UserController from "./controllers/UserController";
import UserTypeController from "./controllers/UserTypeController";
import { ensureAuthenticated } from "./middlewares/EnsureAuthenticated";
import { ensureAuthenticatedAdm } from "./middlewares/EnsureAuthenticatedAdm";
import { ensureAuthenticatedCustomer } from "./middlewares/EnsureAuthenticatedCustomer";
import { trimReceivedValues } from "./middlewares/TrimReceivedValues";

const router = Router();

const userController = new UserController();
const neighborhoodController = new NeighborhoodController();
const addressController = new AddressController();
const customerController = new CustomerController();
const userTypeController = new UserTypeController();
const deliveryController = new DeliveryController();

router.post("/users/", ensureAuthenticated,trimReceivedValues, userController.create);
router.get("/users/", ensureAuthenticated,userController.list);
router.get("/users/:username",ensureAuthenticated, trimReceivedValues, userController.getUserByUsername);

router.post("/login", trimReceivedValues, userController.authenticateUser);

router.get("/neighborhoods/",ensureAuthenticated, neighborhoodController.list);

router.get("/addresses/",ensureAuthenticated, addressController.list);

router.post("/customers/", multer(multerConfig).single("photo"), trimReceivedValues, customerController.create);
router.put("/customers/",ensureAuthenticatedCustomer, trimReceivedValues, multer(multerConfig).single("photo"), customerController.update);
router.put("/customers/user/usertype", ensureAuthenticatedAdm, trimReceivedValues, customerController.changeUserTypeOfCustomer);
router.get("/customers/",ensureAuthenticatedCustomer, customerController.list);
router.get("/customers/:id",ensureAuthenticatedCustomer, trimReceivedValues, customerController.findCustomerById);

router.post("/receiving-points", customerController.getReceivingPoints);

router.get("/user-types",ensureAuthenticatedCustomer, userTypeController.list);

router.post("/delivery", trimReceivedValues, deliveryController.create);
router.put("/delivery",ensureAuthenticatedCustomer, multer(multerConfig).array("photos[]", 8), trimReceivedValues, deliveryController.update);
router.get("/delivery/buyer/:idBuyer",ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.listForBuyer);
router.get("/delivery/receiver/:idReceiver",ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.listForReceiver);
router.get("/delivery/:id", trimReceivedValues,ensureAuthenticatedCustomer, deliveryController.findDeliveryById);

export { router };
