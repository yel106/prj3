import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null); //객체 사용해서 가변적으로 상태 변경
  const navigate = useNavigate();
  const toast = useToast();

  // /edit/:id
  const { id } = useParams();

  //먼저 조회함. updateBoard로 응답 받아옴
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  //값 변경
  function handleTitleEdit(e) {
    updateBoard((draft) => {
      draft.title = e.target.value;
    });
  }

  function handlePriceEdit(e) {
    updateBoard((draft) => {
      draft.price = e.target.value;
    });
  }

  function handleSubmit(e) {
    axios
      .put("/api/board/edit/" + id, {
        title: board.title,
        price: board.price,
      })
      .then((response) =>
        toast({
          description: id + "번 앨범이 수정되었습니다.",
          status: "success",
        }),
      )
      .catch((error) =>
        toast({
          description: "수정 중 문제가 발생하였습니다.",
          status: "error",
        }),
      );
  }

  return (
    <Box>
      <h1>No.{id} 앨범 수정</h1>
      <br />

      {/* TODO: 앨범 이미지 추가 해야함 */}
      <FormControl>
        <FormLabel>앨범 타이틀</FormLabel>
        <Input value={board.title} onChange={handleTitleEdit} />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>가격</FormLabel>
        <Input value={board.price} onChange={handlePriceEdit} />
      </FormControl>

      <Button onClick={() => navigate(-1)} colorScheme="red">
        취소
      </Button>
      <Button onClick={handleSubmit} colorScheme="blue">
        수정
      </Button>
    </Box>
  );
}
