import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faHome,
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
    <Flex>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faHome} />}
        onClick={() => navigate("/")}
      >
        Records Home
      </Button>
      {isAdmin && (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
          onClick={() => navigate("/write")}
        >
          앨범 등록
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
          회원가입
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
          회원정보
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
          회원목록
        </Button>
      )}
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faDollarSign} />}
        onClick={() => navigate("/order")}
      >
        주문하기
      </Button>
      {loggedIn || (
        <Button
          variant="ghost"
          size="lg"
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
          _hover={{ bg: "none" }}
          onClick={handleLogout}
          leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
        >
          로그아웃
        </Button>
      )}
    </Flex>
  );
}

export default NavBar;
