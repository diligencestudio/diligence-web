import type { AccountDTO } from '@diligence/contracts';
import type { Customer } from '../domain/customer.entity';

/** Traduce el cliente de dominio al DTO público (sin el hash de contraseña). */
export function toAccountDTO(customer: Customer): AccountDTO {
  return {
    id: customer.id,
    email: customer.email,
    fullName: customer.fullName,
    phone: customer.phone,
    createdAt: customer.createdAt,
  };
}
