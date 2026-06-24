import type { Customer, NewCustomer } from './customer.entity';

/**
 * Puerto del repositorio de clientes. La capa de aplicación depende de esta
 * interfaz, no de Mongoose (DIP).
 */
export interface CustomerRepository {
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  create(input: NewCustomer): Promise<Customer>;
  updateProfile(
    id: string,
    data: { fullName?: string; phone?: string },
  ): Promise<Customer | null>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
