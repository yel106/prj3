import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

export function NavBar(props) {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
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
    </Flex>
  );
}

export default NavBar;
