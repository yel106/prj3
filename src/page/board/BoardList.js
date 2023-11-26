import React, { useEffect, useState } from "react";
import { Box, Spinner, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";

export function BoardList(props) {
  const [boardList, setBoardList] = useState(null);

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  return (
    <Box>
      <h1>Album list</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Td>앨범 타이틀</Td>
              <Td>앨범 가격</Td>
            </Tr>
          </Thead>

          <Tbody>
            {boardList === null ? (
              <Spinner />
            ) : (
              boardList.map((board) => (
                <Tr>
                  <Td>{board.title}</Td>
                  <Td>{board.board_price}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default BoardList;
