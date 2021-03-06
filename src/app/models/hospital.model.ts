interface IHospitalUser {
  nombre: string;
  uid: string;
  img: string;
}

export class Hospital {
  constructor (
    public nombre: string, 
    public _id: string,
    public usuario?: IHospitalUser,
    public img?: string, 
  ) { }
}