import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function MemberEdit() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 멤버 불러오기
  useEffect(() => {
    getMember();
  }, []);

  function getMember() {
    const accessToken = localStorage.getItem("accessToken");
    console.log("엑세스 토큰", accessToken);
    axios
      .get("/member", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        console.log("getMember()의 then 실행");
        setMember(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("getMember()의 catch 실행");
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response.status === 403) {
          console.log("403에러");
        } else {
          console.log("그 외 에러");
        }
      });
  }

  // 토큰 리프레쉬
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
        getMember();
      })
      .catch((error) => {
        console.log("sendRefreshToken()의 catch 실행");
        localStorage.removeItem("refreshToken");
        toast({
          description: "권한이 없습니다",
          status: "warning",
        });
        //navigate("/login");
      });
  }

  // 해당 멤버 존재하지 않을 경우 Spinner
  if (member === null) {
    return <Spinner />;
  }

  // 수정 여부 확인해서 Status 설정
  // 이름, 패스워드(필수), 주소, 나이, 성별
  let passwordChecked = false;
  if (passwordCheck === password) {
    passwordChecked = true;
  }
  if (password.length === 0) {
    passwordChecked = true;
  }

  function handleEdit() {
    axios
      .put("/member/edit/" + member.id, {
        id: member.id,
        name,
        password,
        address,
        age,
        gender,
      })
      .then(() => {
        toast({
          description: member.id + "번 회원이 수정 됐습니다",
          status: "success",
        });
        navigate("/member?" + member.id);
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "요청이 잘못됐습니다",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중에 문제가 발생했습니다",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }
  return (
    <Box>
      <Heading>{member.name}님 정보</Heading>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={member.password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      {password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}

      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={member.name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Address</FormLabel>
        <Input
          type="text"
          value={member.address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Age</FormLabel>
        <NumberInput
          defaultValue={member.age !== null ? member.age : 20}
          min={15}
          max={99}
          onChange={(value) => setAge(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>Gender</FormLabel>
        <Select
          placeholder={member.gender !== null ? member.gender : "male"}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">male</option>
          <option value="female">female</option>
        </Select>
      </FormControl>

      <Button
        colorScheme="purple"
        isDisabled={!passwordChecked}
        onClick={onOpen}
      >
        수정
      </Button>
      <Button onClick={() => navigate(-1)}>취소</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleEdit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
