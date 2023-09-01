import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from './models/cars.schema';
import { Document, Model } from 'mongoose';
import { CarBase, UpdateCarDto } from './models/cars.dto';

@Injectable()
export class CarsService {

    constructor(
        @InjectModel(Car.name) readonly cars: Model<Car>
    ) { }

    createCar(data: CarBase) {
        const car = this.cars.create(data)
        return car
    }

    async getCars() {
        const cars = await this.cars.find().lean()
        return cars
    }

    async getById(id: Number) {
        const car = await this.cars.findOne({ id }).lean()
        return car
    }

    async updateCar(data: UpdateCarDto) {
        const car = await this.cars.findOneAndUpdate({ id: data.id }, { $set: { price: data.newPrice }, }, { new: true })
        return car
    }

    async deleteCar(id: Number): Promise<Document<unknown | Car>> {
        const car = await this.cars.findOneAndDelete({ id })
        return car
    }
}
