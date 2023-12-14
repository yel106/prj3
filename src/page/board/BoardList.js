//  앨범 쇼핑몰 첫 페이지 상품 셀렉 페이지
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Search } from "./Search";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;
  // 검색 조건을 상태로 관리.
  const [searchParams, setSearchParams] = useState({
    title: "",
    albumFormat: "",
    albumDetails: [],
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
          albumDetails: searchParams.genres
            ? searchParams.genres.join(",")
            : "",
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
        },
      })
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
  function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleLikeClick = () => {
      if (liked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked);
    };
    return (
      <div onClick={handleLikeClick}>
        <FontAwesomeIcon
          icon={faHeart}
          style={{ color: liked ? "#db7093" : "black", fontSize: "30px" }}
        />
        {likeCount}
      </div>
    );
  }
  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPage - 1));
  }

  function handleClickHeart(e, board) {
    e.stopPropagation();
    console.log("heart!");
    axios.postForm("/api/like", { id: board.id });
  }

  return (
    //배경 css적용 테스트. <Box style={{ backgroundColor: "rgb(219, 112, 147)" }}>
    <Box>
      <h1>Album list</h1>
      <Search onSearch={handleSearch} /> {/* 검색 컴포넌트*/}
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
                <Button w={"60%"} variant="solid" colorScheme="pink">
                  + Cart
                </Button>
                {/*<Button w={"40%"}>*/}
                {/*  <FontAwesomeIcon*/}
                {/*    icon={faHeart}*/}
                {/*    style={{ color: "#db7093" }}*/}
                {/*  />*/}
                {/*</Button>*/}
                <FontAwesomeIcon
                  icon={faHeart}
                  onClick={(e) => handleClickHeart(e, board)}
                  style={{ color: "#db7093", fontSize: "30px" }}
                />
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
