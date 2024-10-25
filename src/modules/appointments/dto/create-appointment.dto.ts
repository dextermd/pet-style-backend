export class CreateAppointmentDto {
  appointment_date: Date;
  location?: string;
  status?: number;
  pet?: { id: number };
  user?: { id: number };
  groomer?: { id: number };
}
