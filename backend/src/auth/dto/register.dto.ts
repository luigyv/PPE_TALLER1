import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombre: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'La contraseña debe tener mínimo 8 caracteres',
  })
  @Matches(/[0-9]/, {
    message: 'La contraseña debe contener al menos un dígito',
  })
  @Matches(/[a-z]/, {
    message: 'La contraseña debe contener al menos una minúscula',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'La contraseña debe contener al menos un carácter especial',
  })
  password: string
}