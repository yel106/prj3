import React, { useState } from "react";
import { Box, Button, Input, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";

function CommentList() {
  return null;
}

function CommentForm({ boardId }) {
  const [content, setContent] = useState("");

  const toast = useToast();

  function handleSubmit() {
    axios
      .post("/api/comment/add", {
        boardId: boardId,
        content: content,
      })
      .then(() =>
        toast({
          description: "댓글이 저장되었습니다.",
          status: "success",
        }),
      )
      .catch((error) =>
        toast({
          description: "저장 중 문제가 발생하였습니다.",
          status: "error",
        }),
      );
  }

  return (
    <Box>
      <Textarea
        placeholder="댓글을 작성해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></Textarea>
      <Button onClick={handleSubmit}>작성</Button>
    </Box>
  );
}

export function Comment({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList />
    </Box>
  );
}

export default Comment;
