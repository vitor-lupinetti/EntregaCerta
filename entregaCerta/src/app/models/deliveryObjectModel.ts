import { DeliveryModel } from './deliveryModel';

export interface DeliveryObjectModel extends DeliveryModel{
    delivery: DeliveryModel;
}