import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

//검색 관련 컴포넌트
function Search() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    navigate("/?" + params);
  }
  return (
    <Flex gap={1} mt={3} mb={10}>
      <Box>
        <Select
          defaultValue="all"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">상품 분류 선택</option>
          <option value="CD">CD</option>
          {/*<option value="item">vinyl</option>*/}
          {/*<option value="item">cassette</option>*/}
        </Select>
      </Box>
      <Box>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </Box>
      <Button onClick={handleSearch}>
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Flex>
  );
}
export function BoardList(props) {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const params = new URLSearchParams(location.search); // search속성: URL의 쿼리 문자열을 포함
    const keyword = params.get("k");
    const category = params.get("c");

    axios
      .get(
        `/api/board/list?page=${currentPage}&size=${itemsPerPage}&c=${category}&k=${keyword}`,
      )
      .then((response) => {
        setBoardList(response.data.content);
        setTotalPage(response.data.totalPages);
      });
  }, [currentPage, location.search]); //현재 페이지와 변경될 때마다 실행

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
      <Search /> {/* 검색 컴포넌트*/}
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
              <Td>{/*<Image wit />*/}</Td>
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
