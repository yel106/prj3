import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardList(props) {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    axios
      .get(`/api/board/list?page=${currentPage}&size=${itemsPerPage}`)
      .then((response) => {
        setBoardList(response.data);
        setTotalPages(response.data.totalPages);
      });
  }, [currentPage]);

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
              <Th>앨범 이미지</Th>
              <Th>앨범 타이틀</Th>
              <Th>앨범 가격</Th>
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
