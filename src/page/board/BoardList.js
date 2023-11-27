import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export function BoardList(props) {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`/api/board/list?page=${currentPage}&size=${itemsPerPage}`)
      .then((response) => {
        setBoardList(response.data.content);
        setTotalPage(response.data.totalPages);
        console.log(response.data.content);
      });
  }, [currentPage]);

  if (boardList === null) {
    return <Spinner />;
  }

  const pageButton = [];
  for (let i = 0; i < totalPage; i++) {
    pageButton.push(
      <Button
        key={i}
        onClick={() => setCurrentPage(i)}
        colorScheme={i === currentPage ? "pink" : "white"}
      >
        {i + 1}
      </Button>,
    );
  }

  function handlePreviousPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPage - 1));
  }

  return (
    <Box>
      <h1>Album list</h1>
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

      <Center>
        <ButtonGroup>
          <Button onClick={handlePreviousPage} disable={currentPage === 0}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          {pageButton}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPage - 1}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </ButtonGroup>
      </Center>
    </Box>
  );
}

export default BoardList;
