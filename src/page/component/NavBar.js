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
  HStack,
  CloseButton,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faDollarSign,
  faMusic,
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
  const [titleIconOpen, setTitleIconOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [placement, setPlacement] = React.useState("left");

  const onCloseDrawer = () => {
    // Drawer를 닫는 함수를 정의합니다.
    setTitleIconOpen(false);
  };

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
    <>
      <Flex flexDirection="column">
        <Box position="fixed" top={0} left={0}>
          <Button
            variant="ghost"
            size="lg"
            leftIcon={<FontAwesomeIcon icon={faBars} />}
            onClick={onOpen}
          />
        </Box>
        <Drawer
          bg="gray.100"
          placement={placement}
          isOpen={isOpen}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader
              borderBottomWidth="1px"
              onClick={() => {
                onCloseDrawer();
                navigate("/");
              }}
            >
              🎵 MUSIC IS MY LIFE 🎵
              <CloseButton
                size="md"
                onClick={() => {
                  navigate("/");
                }}
              />
            </DrawerHeader>
            <DrawerBody>
              {/*새로운 음반 등록 시스템 : 관리자만이 접근 가능.*/}
              {isAdmin && (
                <Button
                  border="1px solid black"
                  borderRadius={0}
                  variant="ghost"
                  size="lg"
                  leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
                  onClick={() => navigate("/write")}
                >
                  ALBUM REGISTER SYSTEM
                </Button>
              )}
              {/*로그인으로 가기 */}
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
              {/*멤버로 가입하기 */}
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
              )}{" "}
              <br />
              {/*회원들의 정보" 관리자의 경우 열람 가능 */}
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
              {/*회원 리스트*/}
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
              <br />
              <br />
              {/*주문 버튼 */}
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
              {/*<Button*/}
              {/*  borderRadius={0}*/}
              {/*  variant="ghost"*/}
              {/*  size="lg"*/}
              {/*  leftIcon={<FontAwesomeIcon icon={faMusic} />}*/}
              {/*  onClick={() => navigate("/")}*/}
              {/*>*/}
              {/*  All Item*/}
              {/*</Button>*/}
              {/*로그아웃 버튼 : 로그인 한 경우 */}
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
        {/*회원 가입 버튼*/}

        <>
          {" "}
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
          {/*로그인 버튼 */}
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
        </>
      </Flex>
    </>
  );
}

export default NavBar;
