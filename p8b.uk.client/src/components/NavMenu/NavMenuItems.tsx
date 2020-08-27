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
      id: 2,
      path: "/Contact",
      displayName: "Contact",
   },
   //{
   //   id: 3,
   //   path: "/Login",
   //   displayName: "Login",
   //}
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