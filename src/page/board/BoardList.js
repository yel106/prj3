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
  Flex,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Spacer,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Search } from "./Search";
import YouTube from "react-youtube";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

function LikeContainer({ loggedIn, setLoggedIn, boardId, sendRefreshToken }) {
  const toast = useToast();
  const [like, setLike] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/like/board/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => setLike(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          setLoggedIn(false);
          sendRefreshToken();
        } else {
          console.error("Error fetching like data: ", error);
        }
      });
  }, [boardId, loggedIn]);

  if (like === null) {
    return <center Spinner />;
  }
  function handleLike() {
    if (loggedIn) {
      axios
        .get("/api/like/" + boardId, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => setLike(response.data))
        .catch((error) => {
          if (error.response.status === 401) {
            setLoggedIn(false);
            sendRefreshToken();
          } else {
            console.error("Error fetching like data: ", error);
          }
        })
        .finally(() => console.log(like));
    } else {
      toast({
        description: "로그인 후 이용가능한 서비스입니다",
        status: "error",
      });
    }
  }

  return (
    // <Flex gap={3} ml={400}>
    <Flex>
      <Button
        size="sm"
        onClick={handleLike}
        leftIcon={
          like.isLiked ? (
            <FontAwesomeIcon icon={fullHeart} size="xl" colorScheme="red" />
          ) : (
            <FontAwesomeIcon icon={emptyHeart} size="xl" colorScheme="blue" />
          )
        }
      >
        {/*TODO: CLICK -> Change heart's colorsheme : 12/19*/}
        <Heading fontSize="md">{like.countLike}</Heading>
      </Button>
    </Flex>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;
  const [board, setBoard] = useState();
  // const [like, setLike] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const toast = useToast();
  // const { id } = useParams();
  // const boardId = id;
  const location = useLocation();

  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);

    axios
      .get("/refreshToken", {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then((response) => {
        console.log("sendRefreshToken()의 then 실행");

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        console.log("토큰들 업데이트 리프레시 토큰: ");
        console.log(response.data.refreshToken);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log("sendRefreshToken()의 catch 실행");
        localStorage.removeItem("refreshToken");

        setLoggedIn(false);
      });
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      console.log(localStorage.getItem("accessToken"));
      axios
        .get("/accessToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log("accessToken then 수행");
          setLoggedIn(true);
          console.log(response.data);

          return axios.get("/isSocialMember", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          });
        })
        .then((response) => {
          console.log("isSocialMember = " + response.data);
          if (response.data) {
            setIsSocial(true);
          }
        })
        .catch(() => {
          sendRefreshToken();
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          console.log("finally loggedIn: ", loggedIn);
          console.log("isSocial: " + isSocial);
        });
    }
    console.log("loggedIn: ", loggedIn);
  }, [location]);

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
          stockQuantity: searchParams.stockQuantity,
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

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPage - 1));
  }

  function handleInCart(board) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("카트 클릭");
    axios
      .postForm(
        "/cart/add",
        {
          boardId: board.id,
          stockQuantity: board.stockQuantity,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then((response) => {
        console.log(board.id + "번 상품 카트에 추가");
        toast({
          description: `${board.title} 상품이 장바구니에 추가되었습니다.`,
          status: "success",
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.status === 409) {
          toast({
            title: "재고가 없습니다.",
            description: "수량을 줄이시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        } else {
          toast({
            title: `${board.title} 상품을 장바구니에 추가하지 못했습니다.`,
            description: "다시 한 번 시도해주세요",
            status: "error",
          });
        }
      });
  }

  return (
    <>
      <Box>
        <Spacer h={50} />
        <Search onSearch={handleSearch} /> {/* 검색 컴포넌트*/}
        <Spacer h={50} />
        <SimpleGrid
          borderRadius="ml"
          placeItems="center"
          templateColumns="repeat(4, 1fr)" // 각 열에 4개의 카드를 나열
          gap={3} // 카드 사이의 간격
        >
          {boardList.map((board) => (
            <Card
              border="1px solid blue"
              key={board.fileUrl}
              borderRadius="xl"
              style={{ width: "100%", height: "85%" }}
            >
              <CardHeader>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  {board.fileUrls &&
                    board.fileUrls.map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        borderRadius="xl"
                        border="1px solid red"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                </div>
                <div>
                  <Heading size="md">
                    {board.title} - {board.artist}
                  </Heading>
                  <Heading size="m" textAlign="right">
                    {board.price}원
                  </Heading>
                  {/*<Heading justifyContent="flex-end" size="m">*/}
                  {/*  {board.price}원*/}
                  {/*</Heading>*/}
                  {/*<Heading size="s">{board.releaseDate}</Heading>*/}
                  {/*<Heading size="s">{board.albumFormat}</Heading>*/}
                </div>
                <ButtonGroup spacing="2">
                  <IconButton
                    aria-label="cart"
                    variant="solid"
                    colorScheme="pink"
                    onClick={() => handleInCart(board)}
                    icon={<FontAwesomeIcon icon={faCartPlus} />}
                  />
                  <LikeContainer
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    boardId={board.id}
                    sendRefreshToken={sendRefreshToken}
                  />
                </ButtonGroup>
              </CardHeader>
              <CardBody>
                {/*<ButtonGroup spacing="2">*/}
                {/*  <IconButton*/}
                {/*    aria-label="cart"*/}
                {/*    variant="solid"*/}
                {/*    colorScheme="pink"*/}
                {/*    onClick={() => handleInCart(board)}*/}
                {/*    icon={<FontAwesomeIcon icon={faCartPlus} />}*/}
                {/*  />*/}
                {/*  <LikeContainer*/}
                {/*    loggedIn={loggedIn}*/}
                {/*    setLoggedIn={setLoggedIn}*/}
                {/*    boardId={board.id}*/}
                {/*    sendRefreshToken={sendRefreshToken}*/}
                {/*  />*/}
                {/*</ButtonGroup>*/}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        {/*-----------------------------------------*/}
        {/*페이지 네이션-------------------------------------------*/}
        <Spacer h={50} />
        <Center>
          <ButtonGroup>
            <Button onClick={handlePreviousPage} disable={currentPage === 0}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            {pageButton}
            <Button
              onClick={handleNextPage}
              e
              disabled={currentPage === totalPage - 1}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </ButtonGroup>
        </Center>
        {/*<SimpleGrid minChildWidth="90px">*/}
        {/*  <Box>*/}
        {/*    <YouTube*/}
        {/*      videoId="2kCQEnm8nAg" //비디오 영상 주소*/}
        {/*      opts={{*/}
        {/*        width: "100%",*/}
        {/*        height: "270px",*/}
        {/*        playerVars: {*/}
        {/*          autoplay: 1, //자동 재생 여부*/}
        {/*          modestbranding: 1, //컨트롤 바에 유튜브 로고 표시 여부*/}
        {/*          loop: 1, //반복 재생*/}
        {/*          playlist: "2kCQEnm8nAg", //반복 재생으로 재생할 플레이 리스트*/}
        {/*        },*/}
        {/*      }}*/}
        {/*      onReady={(e) => {*/}
        {/*        e.target.mute(); //소리 끔*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*  <Box>*/}
        {/*    <YouTube*/}
        {/*      videoId="2kCQEnm8nAg" //비디오 영상 주소*/}
        {/*      opts={{*/}
        {/*        width: "100%",*/}
        {/*        height: "270px",*/}
        {/*        playerVars: {*/}
        {/*          autoplay: 1, //자동 재생 여부*/}
        {/*          modestbranding: 1, //컨트롤 바에 유튜브 로고 표시 여부*/}
        {/*          loop: 1, //반복 재생*/}
        {/*          playlist: "2kCQEnm8nAg", //반복 재생으로 재생할 플레이 리스트*/}
        {/*        },*/}
        {/*      }}*/}
        {/*      onReady={(e) => {*/}
        {/*        e.target.mute(); //소리 끔*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*</SimpleGrid>*/}
        <Spacer h={200} />
      </Box>
    </>
  );
}
