import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Flex,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faDollarSign,
  faRecordVinyl,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function NavBar(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
  const toast = useToast();
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const handleDrawerOpen = () => {
  //   setIsDrawerOpen(true);
  // };
  //
  // const handleDrawerClose = () => {
  //   setIsDrawerOpen(false);
  // };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("left");

  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);

    axios
      .get("/refreshToken", {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then((response) => {
        console.log("sendRefreshToken()의 then 실행");

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        console.log("토큰들 업데이트 리프레시 토큰: ");
        console.log(response.data.refreshToken);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log("sendRefreshToken()의 catch 실행");
        localStorage.removeItem("refreshToken");

        setLoggedIn(false);
      });
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      console.log(localStorage.getItem("accessToken"));
      axios
        .get("/accessToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log("accessToken then 수행");
          setLoggedIn(true);
          console.log(response.data);
          if (response.data === "ROLE_ADMIN") {
            console.log("setIsAdmin(true) 동작");
            setIsAdmin(true);
          }
        })
        .catch(() => {
          sendRefreshToken(); //TODO: 이런 곳에 axios. 해서 토큰 갱신
          localStorage.removeItem("accessToken");
        })
        .finally(() => console.log("finally loggedIn: ", loggedIn));
    }
    console.log("loggedIn: ", loggedIn);
  }, [location]);

  function handleLogout() {
    console.log("handleLogout");
    axios
      .get("/api/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      })
      .then((response) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
        if (isAdmin) {
          setIsAdmin(false);
        }
        toast({
          description: "성공적으로 로그아웃 되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 302) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setLoggedIn(false);
          if (isAdmin) {
            setIsAdmin(false);
          }
          // Open a new popup window for the logout URL
          const popupWindow = window.open(
            "http://nid.naver.com/nidlogin.logout?url=http://localhost:8080",
            "_blank",
          );
          if (popupWindow) {
            setTimeout(() => {
              popupWindow.close();
            }, 0); //바로 닫기
          }
          toast({
            description: "성공적으로 로그아웃 되었습니다",
            status: "success",
          });
        } else {
          toast({
            description: "로그아웃 도중 에러가 발생했습니다",
            status: "error",
          });
        }
      })
      .finally(() => {
        console.log("로그아웃 finally");
      });
  }

  return (
    // <Flex>
    //   <Button
    //     borderRadius={0}
    //     variant="ghost"
    //     size="lg"
    //     leftIcon={<FontAwesomeIcon icon={faHome} />}
    //     onClick={() => navigate("/")}
    //   >
    //     Records Home
    //   </Button>
    //   {isAdmin && (
    //     <Button
    //       borderRadius={0}
    //       variant="ghost"
    //       size="lg"
    //       leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
    //       onClick={() => navigate("/write")}
    //     >
    //       앨범 등록
    //     </Button>
    //   )}
    //   {loggedIn || (
    //     <Button
    //       borderRadius={0}
    //       variant="ghost"
    //       size="lg"
    //       leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
    //       onClick={() => navigate("/signup")}
    //     >
    //       회원가입
    //     </Button>
    //   )}
    //   {loggedIn && (
    //     <Button
    //       borderRadius={0}
    //       variant="ghost"
    //       size="lg"
    //       leftIcon={<FontAwesomeIcon icon={faUser} />}
    //       onClick={() => navigate("/member?" + urlParams.toString())}
    //     >
    //       회원정보
    //     </Button>
    //   )}
    //   {isAdmin && (
    //     <Button
    //       borderRadius={0}
    //       variant="ghost"
    //       size="lg"
    //       leftIcon={<FontAwesomeIcon icon={faUsers} />}
    //       onClick={() => navigate("/member/list")}
    //     >
    //       회원목록
    //     </Button>
    //   )}
    //   <Button
    //     borderRadius={0}
    //     variant="ghost"
    //     size="lg"
    //     leftIcon={<FontAwesomeIcon icon={faDollarSign} />}
    //     onClick={() => navigate("/order")}
    //   >
    //     주문하기
    //   </Button>
    //   {loggedIn || (
    //     <Button
    //       variant="ghost"
    //       size="lg"
    //       _hover={{ bg: "none" }}
    //       onClick={() => navigate("/login")}
    //       leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
    //     >
    //       로그인
    //     </Button>
    //   )}
    //   {loggedIn && (
    //     <Button
    //       variant="ghost"
    //       size="lg"
    //       _hover={{ bg: "none" }}
    //       onClick={handleLogout}
    //       leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
    //     >
    //       로그아웃
    //     </Button>
    //   )}
    // </Flex>
    // 12381034675834829084753920-48
    // <Flex flexDirection="column">
    //   <Button
    //     variant="ghost"
    //     size="lg"
    //     leftIcon={<FontAwesomeIcon icon={faBars} />}
    //     onClick={handleDrawerOpen}
    //   >
    //     메뉴
    //   </Button>
    //   <Drawer open={isDrawerOpen} onClose={handleDrawerClose} placement="left">
    //     <Flex flexDirection="column">
    //       {/* 여기에 위에 작성된 코드 속 버튼들을 추가하세요. */}
    //       {isAdmin && (
    //         <Button
    //           borderRadius={0}
    //           variant="ghost"
    //           size="lg"
    //           leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
    //           onClick={() => navigate("/write")}
    //         >
    //           앨범 등록
    //         </Button>
    //       )}
    //       {loggedIn || (
    //         <Button
    //           borderRadius={0}
    //           variant="ghost"
    //           size="lg"
    //           leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
    //           onClick={() => navigate("/signup")}
    //         >
    //           회원가입
    //         </Button>
    //       )}
    //       {loggedIn && (
    //         <Button
    //           borderRadius={0}
    //           variant="ghost"
    //           size="lg"
    //           leftIcon={<FontAwesomeIcon icon={faUser} />}
    //           onClick={() => navigate("/member?" + urlParams.toString())}
    //         >
    //           회원정보
    //         </Button>
    //       )}
    //       {isAdmin && (
    //         <Button
    //           borderRadius={0}
    //           variant="ghost"
    //           size="lg"
    //           leftIcon={<FontAwesomeIcon icon={faUsers} />}
    //           onClick={() => navigate("/member/list")}
    //         >
    //           회원목록
    //         </Button>
    //       )}
    //       <Button
    //         borderRadius={0}
    //         variant="ghost"
    //         size="lg"
    //         leftIcon={<FontAwesomeIcon icon={faDollarSign} />}
    //         onClick={() => navigate("/order")}
    //       >
    //         주문하기
    //       </Button>
    //       {loggedIn || (
    //         <Button
    //           variant="ghost"
    //           size="lg"
    //           _hover={{ bg: "none" }}
    //           onClick={() => navigate("/login")}
    //           leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
    //         >
    //           로그인
    //         </Button>
    //       )}
    //       {loggedIn && (
    //         <Button
    //           variant="ghost"
    //           size="lg"
    //           onClick={handleLogout}
    //           leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
    //         >
    //           로그아웃
    //         </Button>
    //       )}
    //     </Flex>
    //   </Drawer>
    // </Flex>
    <Flex flexDirection="column">
      <Box position="fixed" top={0} left={0}>
        <Button
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faBars} />}
          onClick={onOpen}
        />
      </Box>
      <Drawer placement={placement} isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            🎵 MUSIC IS MY LIFE 🎵
          </DrawerHeader>
          <DrawerBody>
            {isAdmin && (
              <Button
                borderRadius={0}
                variant="ghost"
                size="lg"
                leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
                onClick={() => navigate("/write")}
              >
                ALBUM REGISTER SYSTEM
              </Button>
            )}
            {loggedIn || (
              <Button
                borderRadius={0}
                variant="ghost"
                size="lg"
                leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            )}
            {loggedIn && (
              <Button
                borderRadius={0}
                variant="ghost"
                size="lg"
                leftIcon={<FontAwesomeIcon icon={faUser} />}
                onClick={() => navigate("/member?" + urlParams.toString())}
              >
                Member Info
              </Button>
            )}
            {isAdmin && (
              <Button
                borderRadius={0}
                variant="ghost"
                size="lg"
                leftIcon={<FontAwesomeIcon icon={faUsers} />}
                onClick={() => navigate("/member/list")}
              >
                Member List
              </Button>
            )}
            <Button
              borderRadius={0}
              variant="ghost"
              size="lg"
              leftIcon={<FontAwesomeIcon icon={faDollarSign} />}
              onClick={() => navigate("/order")}
            >
              Order
            </Button>
            <br />
            {loggedIn || (
              <Button
                variant="ghost"
                size="lg"
                _hover={{ bg: "none" }}
                onClick={() => navigate("/login")}
                leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
              >
                Log in
              </Button>
            )}
            {loggedIn && (
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
              >
                Log out
              </Button>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default NavBar;
