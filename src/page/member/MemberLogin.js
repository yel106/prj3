import {useEffect, useState} from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Img,
  Input,
  useToast, VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faN} from "@fortawesome/free-solid-svg-icons";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogin() {
    axios
      .post("/api/member/login", {id, password})
      .then(() => {
        toast({
          description: "로그인 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "아이디나 비밀번호가 틀렸습니다.",
          status: "error"
        });
      });
  }

  function handleKakaoLogin() {
    console.log("카카오 로그인");
  }

  function handleNaverLogin() {
    console.log("네이버 로그인");
  }

  function handleGoogleLogin() {
    console.log("구글 로그인");
  }

  return (
    <Box p={10} borderRadius={10} border="1px solid gray">
      <Heading textAlign="center" mb={10}>Login</Heading>
      <FormControl mb={5}>
        <FormLabel>아이디</FormLabel>
        <Input
          type="text"
          value={id}
          placeholder="아이디를 입력하세요"
          onChange={(e) => setId(e.target.value)}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel>비밀번호</FormLabel>
        <Input
          type="password"
          value={password}
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>로그인</Button>

      <VStack spacing={3}>
        <Button style={{
          backgroundImage:"url('https://study999888777.s3.ap-northeast-2.amazonaws.com/kakao_login_medium_narrow.png')",
          width:"183px",
          height:"45px"}}
          onClick={handleKakaoLogin}
        />
        <Button style={{backgroundImage:"url('https://study999888777.s3.ap-northeast-2.amazonaws.com/btnG_%EC%99%84%EC%84%B1%ED%98%95.png')",
          width:"183px",
          height:"45px",
          backgroundSize:"183px 45px"}}
          onClick={handleNaverLogin}
        />
        <Button backgroundColor="#FFF" boxShadow="md" w="183px" h="45px" _hover={"none"}
                leftIcon={<Img objectFit="cover" boxSize="35px" mr={2}
                  src="https://study999888777.s3.ap-northeast-2.amazonaws.com/web_light_rd_na%401x.png"/>}
                onClick={handleGoogleLogin} fontFamily="Roboto" fontWeight="500">
          Google
        </Button>
      </VStack>
    </Box>
  )

  return null;
}