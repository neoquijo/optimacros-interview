export abstract class CarBase {
    abstract manufacturer: String
    abstract name: String
    abstract price: Number
    abstract year: Number
    abstract model: String
}

export abstract class UpdateCarDto {
    id: String
    newPrice: Number
}