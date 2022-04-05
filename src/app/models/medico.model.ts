import { Hospital } from './hospital.model';

interface IMedicoUser {
  nombre: string;
  uid: string;
  img: string;
}

export class Medico {
  constructor (
    public nombre: string, 
    public hospital: Hospital,
    public _id: string,
    public img?: string, 
    public usuario?: IMedicoUser,
  ) { }
}