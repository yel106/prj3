import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardId); //url에서 id에 boardId가 들어감

    axios
      .get("/api/comment/list?" + params)
      .then((response) => setCommentList(response.data.content));
  }, []);

  return (
    <Card>
      <CardHeader>
        <Heading size="sm">댓글</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="3">
          {commentList.map((comment) => (
            <Box>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.id}님</Heading>
                <Text fontSize="xs">{/*TODO: 댓글 단 시간  {comment. }*/}</Text>
              </Flex>
              <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                {comment.content}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

function CommentForm({ boardId }) {
  const [content, setContent] = useState("");

  const toast = useToast();

  function handleSubmit() {
    setIsSubmitting(true); //submitting을 시작할때 상태가 바뀜. true이면 버튼 비활성화


  return (
    <Box>
      <Textarea
        placeholder="댓글을 작성해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></Textarea>
      <Button onClick={handleSubmit} isDisabled={isSubmitting}>
        {/*버튼 활성화*/}
        작성
      </Button>
    </Box>
  );
}

export function Comment({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false); //제출이 됐는지 알 수 있는 상태를 씀
  //submit했으면 isDisabled가 true되도록 설정

  function handleSubmit(content) {
    setIsSubmitting(true);

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
      )
      .finally(() => setIsSubmitting(false)); //제출 완료되면 버튼 활성화
  }

  return (
    <Box>
      {/*댓글 바로 올라가도록 하려면 CommentForm의 상태를 CommentList가 알도록 해야함.
       부모인 Comment컴포넌트가 그 상태를 갖고있으면 됨. 그리고 prop으로 받기*/}
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList boardId={boardId} />
    </Box>
  );
}

export default Comment;
