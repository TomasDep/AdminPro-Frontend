import { Usuario } from "../models/usuario.model";

export interface CargarUsuarios {
  total: number;
  usuarios: Usuario[];
}