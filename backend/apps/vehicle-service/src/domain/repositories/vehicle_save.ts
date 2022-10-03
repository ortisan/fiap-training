import { Vehicle } from "../models/vehicle";

export interface VehicleSaveRepository {
    save(vehicle: Vehicle): Promise<Vehicle>
}