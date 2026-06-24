/**
 * Cliente registrado (cuenta). Independiente de Mongoose y de la capa HTTP.
 */
export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

/** Datos para crear una cuenta nueva (ya con el hash de la contraseña). */
export interface NewCustomer {
  email: string;
  fullName: string;
  phone: string;
  passwordHash: string;
}
