import React from "react";
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
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
  const toast = useToast();

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
        leftIcon={<FontAwesomeIcon icon={faHome} />}
        onClick={() => navigate("/")}
      >
        Records Home
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
        onClick={() => navigate("/write")}
      >
        앨범 등록
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
        onClick={() => navigate("/signup")}
      >
        회원가입
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faUser} />}
        onClick={() => navigate("/member?" + urlParams.toString())}
      >
        회원정보
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faUsers} />}
        onClick={() => navigate("/member/list")}
      >
        회원목록
      </Button>
      <Button
        borderRadius={0}
        variant="ghost"
        size="lg"
        leftIcon={<FontAwesomeIcon icon={faDollarSign} />}
        onClick={() => navigate("/order")}
      >
        주문하기
      </Button>
      <Button
        variant="ghost"
        size="lg"
        _hover={{ bg: "none" }}
        onClick={() => navigate("/login")}
        leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
      >
        로그인
      </Button>
      <Button
        variant="ghost"
        size="lg"
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
