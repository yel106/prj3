import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Img,
  Input,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [imagePrefix, setImagePrefix] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImagePrefix = async () => {
      try {
        const response = await axios.get("/api/login/image");
        setImagePrefix(response.data);
      } catch (error) {
        console.error("error fetching image prefix", error);
      }
    };
    fetchImagePrefix();
  }, []);

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
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
          status: "error",
        });
      });
  }

  if (imagePrefix === "") {
    return <Spinner />;
  }

  const handleSocialLogin = (socialLoginType) => {
    axios
      .get(`/api/auth/${socialLoginType}`)
      .then((response) => {
        console.log(response.data);
        window.location.href = response.data;
      })
      .catch((error) => console.log(error))
      .finally(() => console.log(`${socialLoginType} 로그인`));
  };

  return (
    <Box p={10} borderRadius={10} border="1px solid gray">
      <Heading textAlign="center" mb={10}>
        Login
      </Heading>
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
      <Button colorScheme="blue" onClick={handleLogin}>
        로그인
      </Button>

      <VStack spacing={3}>
        <Button
          style={{
            backgroundImage: `url('${imagePrefix}kakao_login_medium_narrow.png')`,
            width: "183px",
            height: "45px",
          }}
          onClick={() => handleSocialLogin("KAKAO")}
        />
        <Button
          style={{
            backgroundImage: `url('${imagePrefix}btnG_%EC%99%84%EC%84%B1%ED%98%95.png')`,
            width: "183px",
            height: "45px",
            backgroundSize: "183px 45px",
          }}
          onClick={() => handleSocialLogin("NAVER")}
        />
        <Button
          backgroundColor="#FFF"
          boxShadow="md"
          w="183px"
          h="45px"
          _hover="none"
          leftIcon={
            <Img
              objectFit="cover"
              boxSize="20px"
              mr={2}
              src={`${imagePrefix}%EA%B5%AC%EA%B8%80+%EB%A1%9C%EA%B3%A0.png`}
            />
          }
          onClick={() => handleSocialLogin("GOOGLE")}
          fontFamily="Roboto"
          fontWeight="500"
        >
          Google
        </Button>
      </VStack>
    </Box>
  );
}
