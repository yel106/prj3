import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import CommentComponent from "../component/CommentComponent";
import axiosInstance from "../../axiosInstance";

export function BoardView() {
  const { id } = useParams(); //URL에서 동적인 값을 컴포넌트 내에서 쓸때 사용. <Route>컴포넌트 내에서 렌더링되는 컴포넌트에서만 사용가능
  const [board, setBoard] = useState(null);
  const [fileURL, setFileURL] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [userLogId, setUserLogId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axiosInstance
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data))
      .catch((error) => console.log(error))
      .finally(() => console.log("끝"));
  }, []);
  useEffect(() => {
    axiosInstance
      .get("/api/board/file/id/" + id)
      .then((response) => setFileURL(response.data))
      .catch((e) => console.log(e))
      .finally(() => console.log("끝"));
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      console.log(localStorage.getItem("accessToken"));
      axiosInstance
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

          return axiosInstance.get("/isSocialMember", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          });
        })
        .then((response) => {
          console.log("isSocialMember = " + response.data);
          if (response.data) {
            setIsSocial(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          sendRefreshToken();
        })
        .finally(() => {
          console.log("finally loggedIn: ", loggedIn);
          console.log("isSocial: " + isSocial);
        });
    }
  }, []);

  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);

    axiosInstance
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
    axiosInstance
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
      <>
        <Divider />
        <Box margin="50" border="1px solid black">
          <Center>
            <Stack direction={["column", "row"]} margin="50" justifyContent="">
              <Box border="2px solid black" w="0 auto" h="90%" bg="orange">
                {fileURL.map((url) => (
                  <Box key={url}>
                    <Image
                      src={url}
                      w="600px"
                      h="300px"
                      border="0px solid black"
                    />
                  </Box>
                ))}
              </Box>
              <Box border="1px solid yellow">
                <Heading size="md">앨범명 : {board.title}</Heading>
                <br />
                <br />
                <Heading size="m">아티스트 : {board.artist}</Heading>
                {/*<Heading size="m">Album Introduction : {board.content}</Heading>*/}
                <Heading size="m">앨범 가격 : {board.price}</Heading>
                <Heading size="s">발매일자 : {board.releaseDate}</Heading>
                <Heading size="s">음반 형태: {board.albumFormat}</Heading>
                {/*<Heading size="s">장르 : {board.albumGenres}</Heading>*/}
              </Box>

              {/*관리자 권한 편집 기능*/}
              {isAdmin && (
                <Button
                  colorScheme="pink"
                  onClick={() => navigate("/edit/" + id)}
                >
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
                    <Button onClick={handleDelete}>삭제</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {/* 댓글 */}
            </Stack>
          </Center>
          <Divider />
          <Center marginTop={12}>
            <Box w="80%" h="90%" bg="red">
              <Text sx={{ whiteSpace: "pre-wrap" }} size="m">
                Album Introduction : {board.content}
              </Text>
            </Box>
          </Center>
        </Box>
      </>
      <CommentComponent
        boardId={id}
        loggedIn={loggedIn}
        userLogId={userLogId}
        isAdmin={isAdmin}
      />
    </>
  );
}
