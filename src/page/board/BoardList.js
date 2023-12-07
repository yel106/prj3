import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Input,
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
} from "@fortawesome/free-solid-svg-icons";

//검색 관련 컴포넌트
function Search() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // function handleSearch() {
  //   const params = new URLSearchParams();
  //   params.set("k", keyword);
  //   params.set("c", category);
  //   navigate("/?" + params);
  // }

  /*검색시 */
  function handleSearchAlbum() {
    const params = new URLSearchParams();
    params.set("min", minPrice);
    params.set("max", maxPrice);
    navigate("/?" + params);
  }

  return (
    // <Flex gap={1} mt={3} mb={10}>
    //   <Box>
    //     <Select
    //       defaultValue="all"
    //       onChange={(e) => setCategory(e.target.value)}
    //     >
    //       <option value="all">상품 분류 선택</option>
    //       <option value="CD">CD</option>
    //       {/*<option value="item">vinyl</option>*/}
    //       {/*<option value="item">cassette</option>*/}
    //     </Select>
    //   </Box>
    //
    //   <Box>
    //     <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
    //   </Box>
    //   <Button onClick={handleSearch}>
    //     <FontAwesomeIcon icon={faSearch} />
    //   </Button>
    // </Flex>
    <React.Fragment>
      <Flex mt={5} mb={3}>
        앨범 형식
        <Button size="sm">CD</Button> <Button size="sm">VINYL</Button>
        <Button size="sm">CASSETTE</Button>
      </Flex>
      <Flex mt={3} mb={3}>
        세부 카테고리
        <Button size="sm" colorScheme="gray">
          INDIE
        </Button>{" "}
        <Button size="sm">OST</Button>
        <Button size="sm">K-POP</Button>
        <Button size="sm">POP</Button>
      </Flex>
      <Flex mb={7}>
        가격 직접입력
        <Input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
          max="10000000"
          style={{ width: "200px" }}
        />
        <Input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
          max="10000000"
          style={{ width: "200px" }}
        />
        <Button onClick={handleSearchAlbum}>조회</Button>
      </Flex>
    </React.Fragment>
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
    // const keyword = params.get("k");
    // const category = params.get("c");

    const minPrice = params.get("min");
    const maxPrice = params.get("max");

    axios
      .get(
        // `/api/board/list?page=${currentPage}&size=${itemsPerPage}&c=${category}&k=${keyword}`,
        `/api/board/list?page=${currentPage}&size=${itemsPerPage}&min=${minPrice}&max=${maxPrice}`,
      )
      .then((response) => {
        const filtered = response.data.content.filter((album) => {
          return album.price >= minPrice && album.price <= maxPrice;
        });
        setBoardList(filtered);
        // setBoardList(response.data.content);
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
