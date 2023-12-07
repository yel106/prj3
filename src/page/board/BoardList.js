//  앨범 쇼핑몰 첫 페이지 상품 셀렉 페이지
import React, { useEffect, useState } from "react";
import {
  View,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faHeart,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import * as PropTypes from "prop-types";
import category_CD from "../item/Category_CD";

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
  const [fileUrl, setFileUrl] = useState("");
  const [uploadFiles, setUploadFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    navigate("/?" + params);
  }

  return (
    <Center>
      <Container marginLeft="20">
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          <Button w="100%" h="30" bg="blue.100">
            CD
          </Button>
          <Button w="100%" h="30" bg="blue.100">
            VINYL
          </Button>
          <Button w="200%" h="30" bg="blue.100">
            CASSETTE_TAPE
          </Button>
        </Grid>
      </Container>

      <Flex gap={2} mt={3} mb={10}>
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
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </Box>
        <Button onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </Flex>
    </Center>
  );
}

CardHeader.propTypes = { children: PropTypes.node };
const ITEM_PER_PAGE = 16;

export function BoardList(props) {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState();
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
        const boards = response.data.content;

        // 각 board 객체에 대해 boardFile의 fileUrl을 추출합니다.
        const updatedBoards = boards.map((board) => {
          // boardFile 객체들이 배열 형태로 저장되어 있다고 가정
          const fileUrls = board.boardFiles.map((file) => file.fileUrl);
          return { ...board, fileUrls };
        });
        setBoardList(updatedBoards);
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
    //배경 css적용 테스트. <Box style={{ backgroundColor: "rgb(219, 112, 147)" }}>
    <Box>
      <h1>Album list</h1>
      <Search /> {/* 검색 컴포넌트*/}
      <SimpleGrid
        border="1px solid black"
        placeItems="center"
        templateColumns="repeat(4, 1fr)" // 각 열에 4개의 카드를 나열
        gap={3} // 카드 사이의 간격
      >
        {boardList.map((board) => (
          <Card
            border="0px solid black"
            key={board.fileUrl}
            style={{ width: "100%" }}
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <CardHeader>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {board.fileUrls &&
                  board.fileUrls.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      borderRadius="ml"
                      border="0px solid black"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
              </div>
              <br />
              <Heading size="md">{board.title}</Heading>
              <Heading size="m">{board.artist}</Heading>
              <Heading size="m">{board.price}</Heading>
              <Heading size="s">{board.releaseDate}</Heading>
              <Heading size="s">{board.albumFormat}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{board.content}</Text>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing="2">
                {/* TODO: 클릭하면 위시템 or 카트 페이지로 상품이 등록되도록 하기 */}
                <Button variant="solid" colorScheme="blue">
                  {/*onClick={() => navigate("//" + id) 클릭하면 위시템으로 들어가게하기 */}
                  Wish
                </Button>
                <Button variant="solid" colorScheme="pink">
                  {/*onClick={()=> navigate("/cart/"+ id)}얘도 마찬가지*/}+ Cart
                </Button>
                <Button w={"50px"}>
                  <FontAwesomeIcon icon={faHeart} />
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
