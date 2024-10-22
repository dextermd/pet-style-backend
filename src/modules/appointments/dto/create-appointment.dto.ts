export class CreateAppointmentDto {
  appointment_date: Date;
  location?: string;
  status?: number;
  userId: number;
  petId: number;
  groomerId: number;
}
