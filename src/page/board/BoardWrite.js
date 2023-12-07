import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [albumFormat, setAlbumFormat] = useState("");
  const [albumDetail, setAlbumDetail] = useState("");
  const [agency, setAgency] = useState("");
  const [price, setPrice] = useState("");
  const [uploadFiles, setUploadFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .postForm("/api/board/add", {
        uploadFiles,
        title,
        artist,
        albumFormat,
        albumDetail,
        releaseDate,
        agency,
        price,
      })
      .then(() => {
        toast({
          description: "새 글이 저장되었습니다",
          status: "success",
        });
        navigate("/"); //글 저장이 완료되면 home으로 이동
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 400) {
          toast({
            description: "작성한 내용을 확인 해주세요",
            status: "error",
          });
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Center>
      <Card w={"lg"}>
        <CardHeader>
          <Heading>앨범 등록</Heading>
        </CardHeader>

        <CardBody>
          <FormControl mb={5}>
            <FormLabel>앨범 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
            />
            <FormHelperText>
              한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
            </FormHelperText>
          </FormControl>

          <FormControl mb={5}>
            <FormLabel>Album Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          {/*================================*/}
          <FormControl mb={5}>
            <FormLabel>Artist</FormLabel>
            <Input value={artist} onChange={(e) => setArtist(e.target.value)} />
          </FormControl>

          {/* 앨범 포맷 입력란 */}
          <FormControl mt={4}>
            <FormLabel>Album Format</FormLabel>
            <Select
              value={albumFormat}
              onChange={(e) => setAlbumFormat(e.target.value)}
              placeholder="앨범 포맷을 선택하세요"
            >
              <option value="CD">CD</option>
              <option value="VINYL">VINYL</option>
              <option value="CASSETTE_TAPE">CASSETTE_TAPE</option>
            </Select>
          </FormControl>

          <FormControl mb={5}>
            <FormLabel>Album Detail</FormLabel>
            <Input
              value={albumDetail}
              onChange={(e) => setAlbumDetail(e.target.value)}
            />
          </FormControl>

          {/* 릴리스 날짜 입력란 */}
          <FormControl mt={4}>
            <FormLabel>Release Date</FormLabel>
            <Input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </FormControl>

          {/*발매사 입력란 */}
          <FormControl mt={4}>
            <FormLabel>Agency</FormLabel>
            <Input
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="해당 앨범의 발매회사를 입력해주세요"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Price</FormLabel>
            <Input
              placeholder="1000원 이상 입력해야 합니다."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="1000"
            />
          </FormControl>
        </CardBody>

        <CardFooter>
          <Button
            isDisabled={isSubmitting}
            onClick={handleSubmit}
            colorScheme="blue"
          >
            저장
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}
