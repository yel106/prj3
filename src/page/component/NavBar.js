import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  flexbox,
  useDisclosure,
  useToast,
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
  const [isSocial, setIsSocial] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
  const toast = useToast();
  const [titleIconOpen, setTitleIconOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [placement, setPlacement] = React.useState("left");

  const onCloseDrawer = () => {
    setTitleIconOpen(false);
    navigate("/");
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

          if (response.data.role === "ROLE_ADMIN") {
            console.log("setIsAdmin(true) 동작");
            setIsAdmin(true);
          }

          return axios.get("/isSocialMember", {
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
    let countdownTimer;

    if (loggedIn && isSocial) {
      console.log("========== 소셜 로그인 멤버입니다 ==========");
      console.log("==========" + new Date() + "==========");
      const accessTokenExpiry = 180; // 액세스 토큰 유효 기간 // 3분
      const refreshThreshold = 60; // 5분 남았을 때 요청할 것 //1분
      //2분마다 떠야함
      console.log("타이머 작동되는지 확인");

      // 카운트다운 시작
      const startCountdownTimer = async (expiresIn) => {
        countdownTimer = setInterval(
          async () => {
            await refreshSocialAccessToken();
          },
          (expiresIn - refreshThreshold) * 1000,
        );
      };

      const refreshSocialAccessToken = async () => {
        try {
          console.log("백엔드에 갱신 요청");
          // 백엔드에 갱신 요청
          const response = await axios.get("/api/auth/refreshToken", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          });

          if (response.status === 204) {
            // 소셜 회원이 아닌데 타이머가 작동했다면 OAuthException으로 처리하여 HttpStatus.NO_CONTENT 리턴하도록 함
            setIsSocial(false);
          } else {
            const newExpiresIn = response.data;
            console.log("expiresIn:", newExpiresIn);
            await startCountdownTimer(newExpiresIn);
          }
        } catch (error) {
          //TODO: JWT 소셜 토큰 만료시키는 코드 추가 요망
          toast({
            description: "다시 로그인해주세요.",
            status: "error",
          });
          console.log(error.response.data);
          navigate("/login");
        }
      };

      startCountdownTimer(accessTokenExpiry);
      console.log("========== 소셜 로그인 멤버 검증 완료 ==========");

      return () => clearInterval(countdownTimer);
    }
  }, [loggedIn, isSocial]);

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
          {/* 바 누르면 */}
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
              <DrawerHeader
                borderBottomWidth="1px"
                onClick={() => {
                  onCloseDrawer();
                  navigate("/");
                }}
                display="flex"
              >
                🎵 MUSIC IS MY LIFE 🎵
                <CloseButton
                  size="md"
                  onClick={() => {
                    onClose();
                    navigate("/");
                  }}
                  position="absolute"
                  right="5"
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
                    > ALBUM REGISTER SYSTEM
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
                )}
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
        </Box>
        {/*회원 가입 버튼*/}
      </Flex>
      <nav
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center", // Align items vertically in the center
          width: "100%", // Ensuring the nav takes full width
        }}
      >
        {""}
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
        {!loggedIn && (
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
            _hover={{ bg: "none" }}
            onClick={handleLogout}
            leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
          >
            log out
          </Button>
        )}
      </nav>
    </>
  );
}

export default NavBar;
