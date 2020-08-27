export class dataTable {
   rows: tableRow[];
   headers: tableColHeader[];
   constructor(rows: tableRow[], headers: tableColHeader[]) {
      this.headers = headers;
      this.rows = rows;
   }
}

export class tableColHeader {
   name: string;
   sortName: string;
   isSortable: boolean;
   constructor(name: string, sortName: string, isSortable: boolean) {
      this.name = name;
      this.sortName = sortName;
      this.isSortable = isSortable;
   }
}

export class tableRow {
   data: any[];
   constructor(data: any[]) {
      this.data = data;
   }
}

