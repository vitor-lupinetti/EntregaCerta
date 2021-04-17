import { MessagesService } from './../messages.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultApiCepModel } from 'src/app/models/resultApiCepModel';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor(private http: HttpClient, private message: MessagesService) { }

  async findByCEP(cep: string): Promise<ResultApiCepModel | void> {
    const regexCEP = /^\d{8}$/;

    cep = cep.replace(/\D/g, "");

    if (regexCEP.test(cep)) {
      try {
        let resultAddress = await this.http
          .get<ResultApiCepModel>(`https://viacep.com.br/ws/${cep}/json`)
          .toPromise();

        if (!resultAddress.erro) {
          return resultAddress;
        }

        this.message.showMessageError("Erro ao consultar CEP");
      } catch (err) {
        this.message.showMessageError("Erro ao consultar CEP");
      }
    } else {
      this.message.showMessageError("CEP no formato incorreto");
    }
  }
}
