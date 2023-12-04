import {Box, Button, FormControl, FormLabel, Input, Spinner, useToast, Text, Image, Container} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null); //객체 사용해서 가변적으로 상태 변경
  const navigate = useNavigate();
  const toast = useToast();
  // /edit/:id
  const { id } = useParams();
  const [imageURL, setImageURL] = useState('');
  const [previousImageURL, setPreviousImageURL] = useState('');
  const handleImageUpload=()=>{setPreviousImageURL(imageURL);};
  //먼저 조회함.  updateBoard로 응답 받아옴
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  useEffect(() => {
    if (board !== null) {
      setPreviousImageURL(board.imageURL); // 이전 이미지 URL 설정
    }
  }, [board]);

  if (board === null) {
    return <Spinner />;
  }
  function handleImageURLChange(e){
    setImageURL(e.target.value);
  }


  //타이틀 수정
  function handleTitleEdit(e) {
    updateBoard((draft) => {
      draft.title = e.target.value;
    });
  }
//가격 수정
  function handlePriceEdit(e) {
    updateBoard((draft) => {
      draft.price = e.target.value;
    });
  }


  // 이미지 수정 코드
  // function handleImageUpload(e){}
  //   const file = e.target.images[0]; //
  //   const formData= new FormData();
  //   formData.append("file",file);
  //
  //   axios
  //     .post("/api/upload",formData)
  //     .then((response)=> {
  //       updateBoard((draft)=> {
  //         draft.imageURL = response.data.url; //이미지 url
  //       });
  //     });
  //
  // }


  function handleSubmit(e) {
    axios
      .put("/api/board/edit/" + id, {
        title: board.title,
        price: board.price,
        imageURL:board.imageURL, //이미지도 전송
      })
      .then((response) =>
        toast({
          description: id + "번 앨범이 수정되었습니다.",
          status: "success",
        }),
      )
      .catch((error) =>
        toast({
          description: "수정 중 문제가 발생하였습니다.",
          status: "error",
        }),
      );
  }



  //--------------------------------------등록된 상품 수정 폼
  return (

    <Container>
      <h1>No.{id} Edit </h1>
      <br />


      <FormControl>
        <FormLabel>Album Title</FormLabel>
        <Input value={board.title} onChange={handleTitleEdit} />
      </FormControl>
      {/*가격 수정 */}
      <FormControl>
        <FormLabel>Album Price Edit</FormLabel>
        <Input value={board.price} onChange={handlePriceEdit} />
      </FormControl>

      {/*----------------이미지 파일 수정 코드 --------------*/}
      <FormControl>
        <FormLabel>Album Image Update</FormLabel>
        {/*<Text>Previous Image URL: {previousImageURL}</Text>*/}
        <Text color="red">수정 이전 등록 된 상품의 이미지는 다음과 같습니다.</Text>
        <Image
          src={board.imageURL}
          borderRadius="l"
          border="0px solid black"
        />

        <Input
          value={imageURL}
               onchange={(e) => setImageURL(e.target.value)}
               placeholder="수정하려는 이미지URL을 입력해주세요 "/>
        {/*<Button onClick={handleImageUpload}>Image Update</Button> ----> ????*/}
      </FormControl>

      <Button onClick={() => navigate(-1)} colorScheme="red">
        취소
      </Button>
      <Button onClick={handleSubmit} colorScheme="orange">
        수정
      </Button>
    </Container>
  );
}

