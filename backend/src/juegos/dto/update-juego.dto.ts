import { IsOptional, IsString } from 'class-validator';

// Reescrito a mano (sin @nestjs/mapped-types, que todavía no soporta NestJS 12)
// para que nombre, imagen y categoria sean todos opcionales, tal como quedó
// en el contrato: PATCH acepta "cualquier subconjunto de los campos".
export class UpdateJuegoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  categoria?: string;
}
