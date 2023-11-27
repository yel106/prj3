import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

export function NavBar(props) {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();

  function handleLogout() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "성공적으로 로그아웃 되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "로그아웃 도중 에러가 발생했습니다",
          status: "error",
        });
      })
      .finally(() => console.log("useContext 관련 무언가 삽입해야함"));
  }

  return (
    <Flex>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        onClick={() => navigate("/signup")}
      >
        <FontAwesomeIcon icon={faUserPlus} />
        sign up
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        onClick={() => navigate("/member?" + urlParams.toString())}
      >
        <FontAwesomeIcon icon={faUser} />
        회원정보
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        onClick={() => navigate("/member/list")}
      >
        <FontAwesomeIcon icon={faUsers} />
        회원목록
      </Button>
      <Button
        variant="ghost"
        _hover={{ bg: "none" }}
        onClick={() => navigate("/login")}
        leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
      >
        로그인
      </Button>
      <Button
        variant="ghost"
        _hover={{ bg: "none" }}
        onClick={handleLogout}
        leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
      >
        로그아웃
      </Button>
    </Flex>
  );
}

export default NavBar;
