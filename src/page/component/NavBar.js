import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
        })
        .catch(() => {
          sendRefreshToken();
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
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast({
          description: "성공적으로 로그아웃 되었습니다",
          status: "success",
        });
        setLoggedIn(false);
        if (isAdmin) {
          setIsAdmin(false);
        }
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "로그아웃 도중 에러가 발생했습니다",
          status: "error",
        });
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
