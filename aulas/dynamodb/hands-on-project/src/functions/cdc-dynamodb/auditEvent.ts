export interface AuditEvent {
  eventType: string;
  eventTimestamp: number;
  keys: any;
  newImage: any;
  oldImage: any;
}
