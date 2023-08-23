export interface Row {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface Field {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}
