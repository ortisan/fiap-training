import { Vehicle } from "../models/vehicle"

export enum VehicleFilterType{
    ByName,
    ByYear,
    ByBrand
}

export interface VehicleFilter {
    type: VehicleFilterType,
    value: string
}

export interface VehicleSearchRepository {
    getById(id: string): Promise<Vehicle>
    getByFilters(vehicleFilters: VehicleFilter[], pageNumber?: number): Promise<Vehicle[]> 
}