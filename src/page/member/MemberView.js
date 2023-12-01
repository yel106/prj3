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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    const token= localStorage.getItem("accessToken");
    console.log(token);
      axios
        .get("/member",{headers:{Authorization: `Bearer ${token}`}})
        .then((response) => setMember(response.data))
        .catch((error) => {
          // navigate("/login");
          toast({
            description: "권한이 없습니다",
            status: "warning",
          });
        });
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
