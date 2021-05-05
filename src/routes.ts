import { Router } from "express";
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
import { ensureAuthenticatedEcommerce } from "./middlewares/EnsureAuthenticatedEcommerce";
import { trimReceivedValues } from "./middlewares/TrimReceivedValues";

const router = Router();

const userController = new UserController();
const neighborhoodController = new NeighborhoodController();
const addressController = new AddressController();
const customerController = new CustomerController();
const userTypeController = new UserTypeController();
const deliveryController = new DeliveryController();
const deliveryPhotosController = new DeliveryPhotosController();

router.get("/user-types", ensureAuthenticatedAdm, userTypeController.list);

router.post("/users", ensureAuthenticatedAdm, trimReceivedValues, userController.create);
router.get("/users", ensureAuthenticated, userController.list);
router.delete("/users/:id", ensureAuthenticatedAdm, userController.delete);
router.get("/users/:username", ensureAuthenticated, trimReceivedValues, userController.getUserByUsername);

router.post("/customers", multer(multerConfig).single("photo"), trimReceivedValues, customerController.create);
router.get("/customers", ensureAuthenticatedCustomer, customerController.list);
router.put("/customers", ensureAuthenticatedCustomer, multer(multerConfig).single("photo"), trimReceivedValues, customerController.update);
router.delete("/customers/:id", ensureAuthenticatedCustomer, trimReceivedValues, customerController.delete);
router.get("/customers/:id", ensureAuthenticatedCustomer, trimReceivedValues, customerController.findCustomerById);
router.put("/customers/user/usertype", ensureAuthenticatedAdm, trimReceivedValues, customerController.changeUserTypeOfCustomer);

router.post("/login", trimReceivedValues, userController.authenticateUser);

router.get("/neighborhoods", ensureAuthenticated, neighborhoodController.list);

router.get("/addresses", ensureAuthenticated, addressController.list);

router.post("/receiving-points", ensureAuthenticated, trimReceivedValues, customerController.getReceivingPoints);

router.post("/delivery", ensureAuthenticatedEcommerce, trimReceivedValues, deliveryController.create);
router.put("/delivery", ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.update);
router.get("/delivery/:id", ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.findDeliveryById);
router.get("/delivery/buyer/:idBuyer", ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.listForBuyer);
router.get("/delivery/receiver/:idReceiver", ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.listForReceiver);

router.post("/delivery-photos", ensureAuthenticatedCustomer, multer(multerConfig).single("photo"), trimReceivedValues, deliveryPhotosController.create);
router.delete("/delivery-photos/:id", ensureAuthenticatedCustomer, trimReceivedValues, deliveryPhotosController.delete);
router.get("/delivery-photos/:idDelivery", ensureAuthenticatedCustomer, trimReceivedValues, deliveryPhotosController.list);

router.put("/delivery-delivered/:id", ensureAuthenticatedCustomer, trimReceivedValues, deliveryController.markAsDelivered);

router.put("/confirm-delivery-delivered", trimReceivedValues, deliveryController.confirmDeliveryDelivered);

export { router };
