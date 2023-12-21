import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CloseButton,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  flexbox,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faDollarSign,
  faMusic,
  faRecordVinyl,
  faRightFromBracket,
  faRightToBracket,
  faSearch,
  faSearchDollar,
  faUser,
  faUserPlus,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Search } from "../board/Search";
import { startSocialLoginTimer } from "./authUtils";
import axiosInstance from "../../axiosInstance";

export function NavBar(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
  const toast = useToast();
  const [titleIconOpen, setTitleIconOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const [placement, setPlacement] = React.useState("left");
  const onCloseDrawer = () => {
    setTitleIconOpen(false);
  };
  const handle1Search = (params) => {
    setSearchParams(params);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동.
  };
  const [searchParams, setSearchParams] = useState({
    title: "",
    albumFormat: "",
    albumDetails: [],
  });
  // 검색 조건을 업데이트하는 함수.

  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);

    axiosInstance
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
  // TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      console.log(localStorage.getItem("accessToken"));
      axiosInstance
        .get("/accessToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log("accessToken then 수행");
          setLoggedIn(true);
          console.log(response.data);

          if (response.data.role === "ROLE_ADMIN") {
            console.log("setIsAdmin(true) 동작");
            setIsAdmin(true);
          }

          return axiosInstance.get("/isSocialMember", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          });
        })
        .then((response) => {
          console.log("isSocialMember = " + response.data);
          if (response.data) {
            setIsSocial(true);
          }
        })
        .catch((error) => {
          sendRefreshToken();
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          console.log("finally loggedIn: ", loggedIn);
          console.log("isSocial: " + isSocial);
        });
    }
    console.log("loggedIn: ", loggedIn);
  }, [location]);
  useEffect(() => {
    if (loggedIn && isSocial) {
      const cleanupTimer = startSocialLoginTimer(
        3600, // accessTokenExpiry
        1800, // refreshThreshold
        setIsSocial,
        toast,
        navigate,
      );
      return cleanupTimer;
    }
    return () => {};
  }, [loggedIn, isSocial]);
  function handleLogout() {
    console.log("handleLogout");
    axiosInstance
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
          console.log(
            "로컬스토리지 refreshToken 상태: ",
            localStorage.getItem("refreshToken"),
          );
          console.log(
            "로컬스토리지 accessToken 상태: ",
            localStorage.getItem("accessToken"),
          );
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
  // TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
  return (
    <>
      <Flex flexDirection="column">
        <Text
          justifyContent="space-evenly"
          border="1px solid black"
          margin="8"
          marginTop="70px"
          variant="ghost"
          w="97%"
          h="auto"
          fontFamily=""
          fontSize="80px"
          text-decoration="underline"
          textShadow="0 0 2px black"
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => {
            onCloseDrawer();
            navigate("/");
          }}
        >
          MUE_RECORDS SHOP
        </Text>
        <nav></nav>
        {/*// TODO:TODO:TODO:TODO:여기 보드 리스트의 메뉴바*/}
        <nav
          margin="8"
          style={{
            marginTop: "30px",
            display: "flex",
            border: "1px solid navy",
            w: "97%",
            h: "auto",
            justifyContent: "space-evenly",
            alignItems: "center", // Align items vertically in the center
            width: "100%", // Ensuring the nav takes full width
          }}
        >
          <Button
            variant="ghost"
            size="lg"
            border="1px solid red"
            _hover={{ bg: "none" }}
            onClick={() => navigate("/Cd")}
            leftIcon={<FontAwesomeIcon icon={faMusic} />}
          >
            Cd
          </Button>
          <Button
            variant="ghost"
            size="lg"
            border="1px solid red"
            _hover={{ bg: "none" }}
            onClick={() => navigate("/Vinly")}
            leftIcon={<FontAwesomeIcon icon={faMusic} />}
          >
            Vinyl
          </Button>
          <Button
            variant="ghost"
            size="lg"
            border="1px solid red"
            _hover={{ bg: "none" }}
            onClick={() => navigate("/search")}
            leftIcon={<FontAwesomeIcon icon={faMusic} />}
          >
            CASSETTE TAPE
          </Button>
          {/*<Button*/}
          {/*  variant="ghost"*/}
          {/*  size="lg"*/}
          {/*  border="1px solid red"*/}
          {/*  _hover={{ bg: "none" }}*/}
          {/*  onClick={() => navigate("/search")}*/}
          {/*  leftIcon={<FontAwesomeIcon icon={faSearch} />}*/}
          {/*></Button>*/}
          <Box>
            {loggedIn || (
              <Button
                borderRadius={0}
                variant="ghost"
                border="1px solid red"
                size="lg"
                leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                onClick={() => navigate("/signup")}
              >
                회원가입
              </Button>
            )}
            {!loggedIn && (
              <Button
                variant="ghost"
                size="lg"
                border="1px solid red"
                _hover={{ bg: "none" }}
                onClick={() => navigate("/login")}
                leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
              >
                로그인
              </Button>
            )}
            {loggedIn && (
              <Button
                variant="ghost"
                size="lg"
                border="1px solid red"
                _hover={{ bg: "none" }}
                onClick={handleLogout}
                leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
              >
                log out
              </Button>
            )}
          </Box>
        </nav>
        {/*// TODO:TODO:TODO:TOD: 여기 보드 리스트의 메뉴바*/}
        {/*여기는 햄버거 바 Drawer*/}
        <Box position="fixed" top={0} left={0}>
          <Button
            variant="ghost"
            border="1px solid red"
            size="lg"
            leftIcon={<FontAwesomeIcon icon={faBars} />}
            onClick={onOpen}
          />
          {/*====---------------------------------------------------------------- 바 누르면 */}
          <Drawer
            bg="gray.100"
            placement="left"
            isOpen={isOpen}
            onClose={onClose}
            size={"sm"}
          >
            {/*펼쳐지고*/}
            <DrawerOverlay />
            <DrawerContent>
              {/*머리*/}
              <DrawerHeader
                border="0px solid black"
                borderBottomWidth="1px"
                display="flex"
              >
                <Button
                  marginTop="3"
                  border="0px solid red"
                  variant="ghost"
                  fontSize={30}
                  onClick={() => {
                    onCloseDrawer();
                    onClose();
                    navigate("/");
                  }}
                >
                  🎵 MUSIC IS MY LIFE 🎵
                </Button>
                <CloseButton
                  size="md"
                  border="0px solid blue"
                  onClick={() => {
                    onClose();
                  }}
                  position="absolute"
                  right="5"
                />
                <br />
                <br />
              </DrawerHeader>
              {/*몸통*/}
              <DrawerBody>
                {/*새로운 음반 등록 시스템 : 관리자만이 접근 가능.*/}
                {/*로그인으로 가기 */}
                <br />
                <Stack
                  direction={["column", "row"]}
                  justifyContent="space-evenly"
                >
                  {loggedIn || (
                    <Button
                      textDecoration="underline"
                      // border="1px solid black"
                      variant="ghost"
                      size="lg"
                      borderRadius={0}
                      _hover={{ bg: "none" }}
                      onClick={() => {
                        onCloseDrawer();
                        onClose();
                        navigate("/login");
                      }}
                    >
                      Log in
                    </Button>
                  )}
                  {/*멤버로 가입하기 */}
                  {loggedIn || (
                    <Button
                      textDecoration="underline"
                      // border="1px solid black"
                      borderRadius={0}
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        onCloseDrawer();
                        onClose();
                        navigate("/signup");
                      }}
                    >
                      Sign Up
                    </Button>
                  )}
                  <Button
                    textDecoration="underline"
                    // border="1px solid black"
                    borderRadius={0}
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      onCloseDrawer();
                      onClose();
                      navigate("/order");
                    }}
                  >
                    Order
                  </Button>
                  {loggedIn && (
                    <Button
                      borderRadius={0}
                      variant="ghost"
                      size="lg"
                      onClick={() =>
                        navigate("/member?" + urlParams.toString())
                      }
                    >
                      Member Info
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
                </Stack>
                <br />
                <br />
                <Card
                  variant="ghost"
                  margin="center"
                  w="100%"
                  h="0 auto"
                  border="1px solid black"
                  onClick={() => {
                    onCloseDrawer();
                    onClose();
                  }}
                >
                  <Button
                    border="0px solid black"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/Cd");
                    }}
                    border="0px solid black"
                  >
                    CD
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/Vinyl");
                    }}
                    border="0px solid black"
                  >
                    VINYL
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/Cassette");
                    }}
                    border="0px solid black"
                  >
                    CASSETTE TAPE
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/Cassette");
                    }}
                    border="0px solid black"
                  >
                    Q & A
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/");
                    }}
                    border="0px solid black"
                  >
                    About Shop
                  </Button>
                </Card>
                <Card>
                  {/*" 관리자의 경우 열람 가능 */}
                  {isAdmin && (
                    <Button
                      border="1px solid black"
                      borderRadius={0}
                      variant="ghost"
                      size="lg"
                      leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
                      onClick={() => navigate("/write")}
                    >
                      {" "}
                      ALBUM REGISTER SYSTEM
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
                </Card>
                {/*주문 버튼 */}
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
              </DrawerBody>
              <DrawerFooter border={"1px solid black"} w="100%" h="100px">
                <Box>
                  <p>Company: 뮤레코드 owner: 주예린</p>
                  <p>E-mail: muerecords@gmail.com</p>
                  <p>Address:제주도 서귀포시</p>
                  <p>Bank info: 국민은행 284002-04-192958</p>
                  <p></p>
                  <p></p>
                </Box>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
        {/*회원 가입 버튼*/}
      </Flex>
    </>
  );
}

export default NavBar;
