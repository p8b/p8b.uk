import React, { useState } from 'react';
import { tableColHeader, tableRow } from './Class';

const Table = (props: IProps) => {
   const [isSortAsce, setIsSortAsce] = useState(true);
   const [selectedSortName, setSelectedSortName] = useState(props.DefualtSortName || '');

   const sort = async (sortName: string) => {
      if (selectedSortName === sortName)
         setIsSortAsce((prevVal) => !prevVal);
      setSelectedSortName(sortName);
      props.onThClickAsync && props.onThClickAsync(isSortAsce, selectedSortName);
   };

   const getSortedColCss = (sortName: string) => {
      return selectedSortName === sortName ?
         !isSortAsce ? "fas fa-sort-numeric-down-alt" : "fas fa-sort-numeric-up"
         : "";
   };

   let tblClassName: string;
   tblClassName = `table ${props.striped && "striped"} 
                         ${props.responsive && "responsive"}
                         ${props.border && "table-bordered"}
                         ${props.hover && "table-hover"}
                         ${props.dark && "table-dark"}`;
   return (
      <table className={tblClassName}>
         {props?.colGroup}
         <thead>
            <tr className={props.thrClassName}>
               {(props.headerList != null && props.headerList.length > 0) &&
                  props.headerList.map(header =>
                     header.isSortable ?
                        <th children={
                           <div>
                              <i className={getSortedColCss(header.sortName)} />
                              <text className="underline">{header.name}</text>
                           </div>}
                           className={props.thhClassName}
                           onClick={() => sort(header.sortName)}
                        />
                        : <th key={Math.random()} children={header.name}
                           className={props.thClassName} />
                  )
               }
            </tr>
         </thead>
         {(props.rowList && props.rowList.length > 0) &&
            <tbody>
               {props?.preRow}
               {props.rowList.map(row =>
                  <tr className={props.tbrCLassName} key={Math.random()} >
                     {row.data.map(d =>
                        <td key={Math.random()} children={d} />)}
                  </tr>
               )}
               {props?.postRow}

            </tbody>
         }
      </table>
   );
};

interface IProps {
   striped?: boolean,
   responsive?: boolean,
   dark?: boolean,
   border?: boolean,
   hover?: boolean,
   colGroup?: any,
   DefualtSortName?: string,
   tblClassName?: string,
   thhClassName?: string,
   thClassName?: string,
   tbrCLassName?: string,
   thrClassName?: string,
   preRow?: any,
   postRow?: any,
   headerList?: tableColHeader[],
   rowList?: tableRow[],
   onThClickAsync?: (isSortAsce: boolean, selectedSortName: string) => void;
}
export default Table;