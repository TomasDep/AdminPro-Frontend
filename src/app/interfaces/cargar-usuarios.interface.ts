import { Usuario } from "@models/usuario.model";

export interface ICargarUsuarios {
  total: number;
  usuarios: Usuario[];
}