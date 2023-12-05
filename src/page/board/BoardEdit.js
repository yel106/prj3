import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Spinner,
  useToast
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null); //객체 사용해서 가변적으로 상태 변경
  // /edit/:id
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState('');
  const [previousFileUrl, setPreviousFileUrl] = useState('');
  const handleFileUrl=()=>{setPreviousFileUrl(fileUrl);};
  //먼저 조회함.  updateBoard로 응답 받아옴
  const navigate = useNavigate();
  const toast = useToast();




  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  useEffect(() => {
    if (board !== null) {
      setPreviousFileUrl(board.id.fileUrl); // 이전 이미지 URL 설정
    }
  }, [board]);

  if (board === null) {
    return <Spinner />;
  }
  function handleFileUrlChange(e){
    setFileUrl(e.target.value);
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
        fileUrl:board.fileUrl, //이미지도 전송
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
  function handleDeleteFileUrl() {
    axios
      .delete(`/api/board/file/delete/${id}`) // 해당 아이디에 해당하는 fileUrl 삭제 API endpoint를 호출합니다.
      .then((response) => {
        toast({
          description: `ID ${id}의 파일 URL이 성공적으로 삭제되었습니다.`,
          status: "success",
        });
        setFileUrl(''); // fileUrl 상태를 초기화합니다.
      })
      .catch((error) => {
        toast({
          description: `파일 URL 삭제 중 문제가 발생하였습니다.`,
          status: "error",
        });
      });
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
      <Button onClick={handleDeleteFileUrl} colorScheme="red">
        파일 URL 삭제
      </Button>
      <FormControl>
        <FormLabel>Album Image Update</FormLabel>


        <Image
          src={board.fileUrl}
          borderRadius="l"
          border="0px solid black"
        />

        <Input
          value={fileUrl}
          onchange={(e) => setFileUrl(e.target.value)}
          placeholder="수정하려는 이미지URL을 입력해주세요 "/>
        <br/>
        <FormHelperText color="red.200">
          한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부 가능합니다.
        </FormHelperText>

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

