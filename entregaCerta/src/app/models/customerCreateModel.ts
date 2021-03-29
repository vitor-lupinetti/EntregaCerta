export interface customerCreateModel {
  name: string;
  photo: File;
  email: string;
  contactNumber: string;
  hasWhatsApp: string;
  cep: string;
  street: string;
  homeNumber: string;
  complement: string;
  neighborhood: string;
  password?: string;
  user?: string;
  photo_url?:string;
  id?:string;
}