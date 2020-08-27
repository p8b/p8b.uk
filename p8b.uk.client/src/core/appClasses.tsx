import { AlertTypes } from "./constant.Variables";

export class Error {
   key?: string;
   value?: string | any;
   constructor(key?: string | number, value?: string | any) {
      this.key = key?.toString();
      this.value = value;
   };

};

export class ddLookup {
   id: number;
   name: string;

   constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
   }
}

export class AlertObj {
   List: Error[] = [];
   Type?: AlertTypes;

   constructor(list?: Error[], type?: AlertTypes) {
      this.List = list ?? [];
      this.Type = type;
   }
   checkExist(inputName: string = "") {
      return !!this.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase());
   }
}
