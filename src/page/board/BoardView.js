import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import CommentComponent from "../component/CommentComponent";

export function BoardView() {
  const { id } = useParams(); //URL에서 동적인 값을 컴포넌트 내에서 쓸때 사용. <Route>컴포넌트 내에서 렌더링되는 컴포넌트에서만 사용가능
  const [board, setBoard] = useState(null);
  const [fileURL, setFileURL] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLogId, setUserLogId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data))
      .catch((error) => console.log(error))
      .finally(() => console.log("끝"));
  }, []);
  useEffect(() => {
    axios
      .get("/api/board/file/id/" + id)
      .then((response) => setFileURL(response.data))
      .catch((e) => console.log(e))
      .finally(() => console.log("끝"));
  }, []);

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
          console.log(response.data);
          setLoggedIn(true);
          setUserLogId(response.data.logId);
          if (response.data.role === "ROLE_ADMIN") {
            console.log("setIsAdmin(true) 동작");
            setIsAdmin(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          sendRefreshToken();
        })
        .finally(() => console.log());
    }
  }, []);

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
      })
      .finally(() => console.log(loggedIn));
  }

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .delete("/api/board/remove/" + id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        toast({
          description: id + "번 앨범이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  return (
    <>
      <Center>
        <Stack direction={["column", "row"]} margin="0" justifyContent="">
          <Box border="2px solid black" w="90%" h="90%" bg="white">
            {fileURL.map((url) => (
              <Box key={url}>
                <Image src={url} w="600px" h="300px" border="1px solid black" />
              </Box>
            ))}
          </Box>
          <Box border="1px solid red">
            <Heading size="md">Title : {board.title}</Heading>
            <Heading size="m">Artist : {board.artist}</Heading>
            <Heading size="m">Album Introduction : {board.content}</Heading>
            <Heading size="m">Album Price : {board.price}</Heading>
            <Heading size="s">Album ReleaseDate : {board.releaseDate}</Heading>
            <Heading size="s">Album Format : {board.albumFormat}</Heading>
            <Heading size="s">Album Genre : {board.albumDetails}</Heading>
          </Box>
          {/*관리자 권한 편집 기능*/}
          {isAdmin && (
            <Button colorScheme="pink" onClick={() => navigate("/edit/" + id)}>
              edit
            </Button>
          )}
          {isAdmin && (
            <Button colorScheme="orange" onClick={onOpen}>
              delete
            </Button>
          )}

          {/* 삭제 모달 */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Message</ModalHeader>
              <ModalCloseButton />
              <ModalBody>해당 상품을 삭제 하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button onClose={onClose}>닫기</Button>
                <Button onClick={handleDelete} colorScheme="red">
                  삭제
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* 댓글 */}
        </Stack>
      </Center>
      <CommentComponent
        boardId={id}
        loggedIn={loggedIn}
        userLogId={userLogId}
        isAdmin={isAdmin}
      />
    </>
  );
}
