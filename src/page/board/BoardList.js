import React, {useEffect, useState} from "react";
import {Box, Button, ButtonGroup, Center, Spinner, Table, Tbody, Td, Th, Thead, Tr,} from "@chakra-ui/react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight,} from "@fortawesome/free-solid-svg-icons";
import {Search} from "./Search";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;
  // 검색 조건을 상태로 관리.
  const [searchParams, setSearchParams] = useState({
    title: '',
    albumFormat: '',
    albumDetails: []
  });
  // 검색 조건을 업데이트하는 함수.
  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동.
  };
  useEffect(() => {
    // searchParams 상태를 사용하여 API 호출을 업데이트.
    axios
        .get(`/api/board/list`, {
          params: {
            page: currentPage,
            size: itemsPerPage,
            title: searchParams.title,
            albumFormat: searchParams.format,
            // albumDetails가 undefined가 아닌 경우에만 join을 호출.
            albumDetails: searchParams.genres ? searchParams.genres.join(',') : '',
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice
          }
        })
        .then((response) => {
          setBoardList(response.data.content);
          setTotalPage(response.data.totalPages);
        });
  }, [currentPage, searchParams]);

  if (boardList === null) {
    return <Spinner />;
  }

  const pageButton = [];
  for (let i = 0; i < totalPage; i++) {
    pageButton.push(
      <Button
        key={i}
        onClick={() => setCurrentPage(i)}
        colorScheme={i === currentPage ? "pink" : "gray"}
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
      <Search onSearch={handleSearch} /> {/* 검색 컴포넌트*/}
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
              key={board.id}
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
