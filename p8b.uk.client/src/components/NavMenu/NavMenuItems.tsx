/// Navigation menu items for different users
export const DefaultNav = [
   {
      id: 0,
      path: "/",
      displayName: "Home",
   },
   {
      id: 1,
      path: "/About",
      displayName: "About",
   },
   {
      id: 1,
      path: "/Contact",
      displayName: "Contact",
   }
];

export const LoginNav = [
   {
      id: 0,
      path: "/",
      displayName: "Home",
   },
];

export declare type INavItem = {
   id: number,
   path: string,
   displayName: string,
};