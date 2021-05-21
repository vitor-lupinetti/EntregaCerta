export interface ScheduleModel{
    id?:string
    idDelivery: string,
    date: string, 
    place: string,
    time: string,
    reason?: string;
}