import { CustomerModel } from './customerModel';

export interface ResultModel extends CustomerModel{
    customer:CustomerModel;
}