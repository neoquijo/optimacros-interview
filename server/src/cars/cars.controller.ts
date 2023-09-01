import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarBase, UpdateCarDto } from './models/cars.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Post('/new')
  create(@Body() data: CarBase) {
    console.log(data)
    const car = this.carsService.createCar(data)
    return car
  }

  @Post('/update')
  async updatePrice(@Body() data: UpdateCarDto) {
    const car = await this.carsService.updateCar(data)
    return car
  }

  @Post('/delete')
  async deleteCar(@Body('id') id: Number) {
    const car = await this.carsService.deleteCar(id)
    return car
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const car = await this.carsService.getById(Number(id))
    return car
  }

  @Get('/')
  async all() {
    const cars = await this.carsService.getCars()
    return cars
  }
}
