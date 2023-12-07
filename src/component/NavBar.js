import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>Records Home</Button>


      <Button onClick={() => navigate("/write")}>앨범 등록</Button>
    </Flex>
  );
}

// import { Button, Flex, Spacer, useToast } from "@chakra-ui/react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useContext, useEffect } from "react";
// import { LoginContext } from "./LogInProvider";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faAddressBook,
//     faArrowRightFromBracket,
//     faArrowRightToBracket,
//     faCircleInfo,
//     faFeatherPointed,
//     faHouse,
//     faUserPlus,
// } from "@fortawesome/free-solid-svg-icons";
//
// export function NavBar() {
//     const { fetchLogin, login, isAuthenticated, isAdmin } =
//         useContext(LoginContext);
//     const toast = useToast();
//
//     const navigate = useNavigate();
//
//     const urlParams = new URLSearchParams();
//
//     const location = useLocation();
//
//     useEffect(() => {
//         fetchLogin();
//     }, [location]);
//
//     if (login !== "") {
//         urlParams.set("id", login.id);
//     }
//
//     function handleLogout() {
//         axios.post("/api/member/logout").then(() => {
//             toast({
//                 description: "로그아웃 되었습니다.",
//                 status: "info",
//             });
//             navigate("/");
//         });
//     }
//
//     return (
//         <Flex mb={8}>
//             <Button
//                 borderRadius={0}
//                 variant="ghost"
//                 size="lg"
//                 leftIcon={<FontAwesomeIcon icon={faHouse} />}
//                 onClick={() => navigate("/")}
//             >
//                 Records Home
//             </Button>
//             {isAuthenticated() && (
//                 <Button
//                     borderRadius={0}
//                     variant="ghost"
//                     size="lg"
//                     leftIcon={<FontAwesomeIcon icon={faFeatherPointed} />}
//                     onClick={() => navigate("/write")}
//                 >
//                     앨범 등록
//                 </Button>
//             )}
//             {/*<Spacer />*/}
//             {/*{isAuthenticated() || (*/}
//             {/*    <Button*/}
//             {/*        borderRadius={0}*/}
//             {/*        variant="ghost"*/}
//             {/*        size="lg"*/}
//             {/*        leftIcon={<FontAwesomeIcon icon={faUserPlus} />}*/}
//             {/*        onClick={() => navigate("/signup")}*/}
//             {/*    >*/}
//             {/*        회원가입*/}
//             {/*    </Button>*/}
//             {/*)}*/}
//             {/*{isAdmin() && (*/}
//             {/*    <Button*/}
//             {/*        borderRadius={0}*/}
//             {/*        variant="ghost"*/}
//             {/*        size="lg"*/}
//             {/*        leftIcon={<FontAwesomeIcon icon={faAddressBook} />}*/}
//             {/*        onClick={() => navigate("/member/list")}*/}
//             {/*    >*/}
//             {/*        회원목록*/}
//             {/*    </Button>*/}
//             {/*)}*/}
//             {/*{isAuthenticated() && (*/}
//             {/*    <Button*/}
//             {/*        borderRadius={0}*/}
//             {/*        variant="ghost"*/}
//             {/*        size="lg"*/}
//             {/*        leftIcon={<FontAwesomeIcon icon={faCircleInfo} />}*/}
//             {/*        onClick={() => navigate("/member?" + urlParams.toString())}*/}
//             {/*    >*/}
//             {/*        {login.nickName}님*/}
//             {/*    </Button>*/}
//             {/*)}*/}
//             {/*{isAuthenticated() || (*/}
//             {/*    <Button*/}
//             {/*        borderRadius={0}*/}
//             {/*        variant="ghost"*/}
//             {/*        size="lg"*/}
//             {/*        leftIcon={<FontAwesomeIcon icon={faArrowRightToBracket} />}*/}
//             {/*        onClick={() => navigate("/login")}*/}
//             {/*    >*/}
//             {/*        로그인*/}
//             {/*    </Button>*/}
//             {/*)}*/}
//             {/*{isAuthenticated() && (*/}
//             {/*    <Button*/}
//             {/*        borderRadius={0}*/}
//             {/*        variant="ghost"*/}
//             {/*        size="lg"*/}
//             {/*        leftIcon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}*/}
//             {/*        onClick={handleLogout}*/}
//             {/*    >*/}
//             {/*        로그아웃*/}
//             {/*    </Button>*/}
//             {/*)}*/}
//         </Flex>
//     );
// }
