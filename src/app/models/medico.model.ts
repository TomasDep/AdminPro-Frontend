import { Hospital } from './hospital.model';

interface IMedicoUser {
  nombre: string;
  uid: string;
  img: string;
}

export class Medico {
  constructor (
    public nombre: string, 
    public uid?: string,
    public img?: string, 
    public usuario?: IMedicoUser,
    public hospital?: Hospital
  ) { }
}