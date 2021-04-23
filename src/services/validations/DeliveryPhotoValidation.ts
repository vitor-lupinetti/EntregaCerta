import * as yup from "yup";

import { DeliveryPhotoEntity } from "../../entities/DeliveryPhotoEntity";
import { DeliveryPhotoService } from "../DeliveryPhotoService";
import DeliveryService from "../DeliveryService";
import { Validation } from "./Validation";

export class DeliveryPhotoValidation extends Validation<DeliveryPhotoEntity> {
    protected async validateFields(deliveryPhoto: DeliveryPhotoEntity, isCreate: boolean): Promise<void> {
        const schema = yup.object().shape({
            photo: yup.string().required("Imagem obrigatória")
        });

        try {
            await schema.validate(deliveryPhoto, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }

        await this.verifyIfDeliveryExists(deliveryPhoto.idDelivery);
    }

    protected async verifyIfExists(service: DeliveryPhotoService, deliveryPhoto: DeliveryPhotoEntity, isCreate: boolean): Promise<void> {
        /* Nada para validar */
    }

    private async verifyIfDeliveryExists(idDelivery: string): Promise<void> {
        const deliveryService = new DeliveryService();

        const deliveryFound = await deliveryService.findOne({ where: { id: idDelivery } });

        if (!deliveryFound) {
            this.errors.push("Entrega não encontrada");
        }
    }
}
