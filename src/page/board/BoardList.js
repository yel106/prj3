import React, { useEffect, useState } from "react";
import { Box, Spinner, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardList(props) {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>Album list</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Td>앨범 이미지</Td>
              <Td>앨범 타이틀</Td>
              <Td>앨범 가격</Td>
            </Tr>
          </Thead>

          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.title}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{/* TODO: 앨범 이미지 */}</Td>
                <Td>{board.title}</Td>
                <Td>{board.price}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default BoardList;
