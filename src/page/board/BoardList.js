import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Table,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faSearch,} from "@fortawesome/free-solid-svg-icons";
import * as PropTypes from "prop-types";

//검색 관련 컴포넌트
function Search() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [albumFormat, setAlbumFormat] = useState("");
  const [agency, setAgency] = useState("");
  const [price, setPrice] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [uploadFiles, setUploadFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <option value="VINYL">VINYL</option>
          <option value="CASSETTETAPE">CASSETTE_TAPE</option>
        </Select>
      </Box>
      <Box>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
      </Box>
      <Button onClick={handleSearch}>
        <FontAwesomeIcon icon={faSearch}/>
      </Button>
    </Flex>
  );
}


CardHeader.propTypes = {children: PropTypes.node};

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
    return <Spinner/>;
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
      <Search/> {/* 검색 컴포넌트*/}
      <SimpleGrid
        border="1px solid red"
        placeItems="center"
        templateColumns="repeat(4, 1fr)" // 각 열에 4개의 카드를 나열
        gap={4} // 카드 사이의 간격
      >
        {boardList.map((board) => (
          <Card key={board.id} style={{ width: '100%' }}>
            <CardHeader>
              <Image
                src={board.imageURL}
                borderRadius="ml"
                border="1px solid black"
              />
                <Heading size='md'>{board.title}</Heading>
                <Heading size='m'>{board.artist}</Heading>
                <Heading size='m'>{board.price}</Heading>
                <Heading size='xs'>{board.releaseDate}</Heading>
                <Heading size='xs'>{board.albumFormat}</Heading>
              </CardHeader>
              <CardBody>
                <Text>앨범 소개 글</Text>
              </CardBody>
              <CardFooter>
                <ButtonGroup spacing='2'>
                  <Button variant='solid' colorScheme='blue'>
                    Wish
                  </Button>
                  <Button variant='solid' colorScheme='pink'>
                    + Cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
          </Card>
        ))}
      </SimpleGrid>



      {/*-----------------------------------------*/}
      {/*페이지 네이션-------------------------------------------*/}
      <Center>
        <ButtonGroup>
          <Button onClick={handlePreviousPage} disable={currentPage === 0}>
            <FontAwesomeIcon icon={faChevronLeft}/>
          </Button>
          {pageButton}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPage - 1}
          >
            <FontAwesomeIcon icon={faChevronRight}/>
          </Button>
        </ButtonGroup>
      </Center>
    </Box>
  );
}