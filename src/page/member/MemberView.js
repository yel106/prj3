import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberView() {
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [orderNames, setOrderNames] = useState([]);

  function getMember() {
    const accessToken = localStorage.getItem("accessToken");
    console.log("엑세스 토큰", accessToken);
    axios
      .get("/member", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        console.log("getMember()의 then 실행");
        setMember(response.data);
        return axios.get(`/member/${response.data.logId}/orders`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      })
      .then((response) => {
        setOrderNames(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("getMember()의 catch 실행");
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response && error.response.status === 403) {
          toast({
            description: "접근이 거부되었습니다",
            status: "error",
          });
          console.log("403에러!!!");
        } else {
          toast({
            description: "오류가 발생했습니다",
            status: "error",
          });
          console.log("그 외 에러");
        }
      });
  }
  // 주문 이름들을 표시하는 폼 컨트롤
  const orderNameControls = orderNames.map((orderName, index) => (
    <FormControl key={index}>
      <FormLabel>Order Name {index + 1}</FormLabel>
      <Input type="text" value={orderName} readOnly />
    </FormControl>
  ));

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
        //navigate("/login");
        toast({
          description: "권한이 없습니다",
          status: "warning",
        });
      });
  }

  useEffect(() => {
    getMember();
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDelete() {}

  return (
    <Box>
      <h1>{member.logId}님 정보</h1>
      <FormControl>
        <FormLabel>name</FormLabel>
        <Input value={member.name} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>address</FormLabel>
        <Input type="text" value={member.address} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input value={member.email} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>gender</FormLabel>
        <Input type="text" value={member.gender} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>role</FormLabel>
        <Input type="text" value={member.role} readOnly />
      </FormControl>
      <Button colorScheme="purple" onClick={() => navigate("/medit/" + 1)}>
        수정
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        탈퇴
      </Button>
      {orderNameControls}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
