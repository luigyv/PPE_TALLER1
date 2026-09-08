import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('juegos')
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  // GET /juegos?search=&page=1&limit=10  -> pública (no protegida)
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.juegosService.findAll({
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  // GET /juegos/:id  -> pública
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.juegosService.findOne(id);
  }

  // POST /juegos  -> PROTEGIDA con JWT
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createJuegoDto: CreateJuegoDto) {
    return this.juegosService.create(createJuegoDto);
  }

  // PATCH /juegos/:id  -> PROTEGIDA con JWT
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJuegoDto: UpdateJuegoDto,
  ) {
    return this.juegosService.update(id, updateJuegoDto);
  }

  // DELETE /juegos/:id  -> PROTEGIDA con JWT
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.juegosService.remove(id);
  }
}
