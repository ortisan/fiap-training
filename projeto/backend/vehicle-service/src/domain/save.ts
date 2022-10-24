import { Vehicle } from "./models";

export enum VehicleFilterType{
    ByName,
    ByYear,
    ByBrand
}

export interface VehicleFilter {
    type: VehicleFilterType,
    value: string
}

export interface VehicleRepository {
    save(vehicle: Vehicle): Promise<Vehicle>
    getById(id: string): Promise<Vehicle>
    getByFilters(vehicleFilters: VehicleFilter[], pageNumber?: number): Promise<Vehicle[]> 
}