// import {createContext, useEffect, useState} from "react";
// import axios from "axios";
//
// export const LoginContext = createContext(null);
// export function LogInProvider({children}) {
//   const [login, setLogin] = useState("");
//
//
//   function fetchLogin(token) {
//     // const token = localStorage.getItem('token');
//     if(token){
//     axios.get("/login", {headers:{Authorization: `Bearer ${token}`}}).then((response) => {
//       setLogin(response.data);
//       console.log(response.data);
//     }).catch((error)=>console.log(error));}
//     else{
//       console.log("No token");
//     }
//   }
//
//   function isAuthenticated(){
//     return login !== ""; // 빈 스트링이 아니면 로그인된 상태
//   }
//
//   function isAdmin(){
//     if(login.role){
//       return true; //login.role.some(e=>e.name==="admin");
//     }
//     return false;
//   }
//
//   useEffect(() => {
//     fetchLogin();
//   }, []);
//
//   function hasAccess(userId){
//     return login.logId === userId;
//   }
//
//   return (
//     <LoginContext.Provider value={{login, fetchLogin, isAuthenticated, hasAccess, isAdmin}}>
//       {children}
//     </LoginContext.Provider>
//   );
// }