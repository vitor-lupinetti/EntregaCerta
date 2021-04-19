import { NextFunction, Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";
import { AddressController } from "./controllers/AddressController";
import { CustomerController } from "./controllers/CustomerController";
import DeliveryController from "./controllers/DeliveryController";
import DeliveryPhotosController from "./controllers/DeliveryPhotosController";
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
const deliveryPhotosController = new DeliveryPhotosController();

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
router.put("/delivery",ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.update);
router.get("/delivery/buyer/:idBuyer",ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.listForBuyer);
router.get("/delivery/receiver/:idReceiver",ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.listForReceiver);
router.get("/delivery/:id", trimReceivedValues,ensureAuthenticatedCustomer, deliveryController.findDeliveryById);

router.post("/delivery-photos",ensureAuthenticatedCustomer, multer(multerConfig).single("photo"), trimReceivedValues, deliveryPhotosController.create);
router.get("/delivery-photos/:idDelivery",ensureAuthenticatedCustomer, trimReceivedValues, deliveryPhotosController.list);
router.delete("/delivery-photos",ensureAuthenticatedCustomer, trimReceivedValues, deliveryPhotosController.delete);


export { router };
