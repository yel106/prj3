import {useState} from "react";
import {Box, Button, FormControl, FormLabel, Heading, Input, useToast} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

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

  return (
    <Box>
      <Heading textAlign="center">Login</Heading>
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input
          type="text"
          value={id}
          placeholder="아이디를 입력하세요"
          onChange={(e) => setId(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input
          type="password"
          value={password}
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>로그인</Button>
    </Box>
  )

  return null;
}