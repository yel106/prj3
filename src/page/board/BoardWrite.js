import React, {useState} from "react";
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
    Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function BoardWrite() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [albumFormat, setAlbumFormat] = useState("");
    const [agency, setAgency] = useState("");
    const [price, setPrice] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [uploadFiles, setUploadFiles] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    function handleSubmit() {
        setIsSubmitting(true);

        axios
            .postForm("/api/board/add", {
                uploadFiles,title, artist, albumFormat, releaseDate,agency, price, imageURL
            })
            .then(() => {
                toast({
                    description: "새 상품이 저장되었습니다", status: "success",
                });
                navigate("/"); //글 저장이 완료되면 home으로 이동
            })
            .catch((error) => {
                console.log(error.response.status);
                if (error.response.status === 400) {
                    toast({
                        description: "작성한 내용을 확인해주세요", status: "error",
                    });
                } else {
                    toast({
                        description: "저장 중에 문제가 발생하였습니다.", status: "error",
                    });
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    let imageURl;
    return (<Center>
        <Card w={"lg"}>
            <CardHeader>
                <Heading>앨범 등록</Heading>
            </CardHeader>

            <CardBody>
                {/*//////////////////////////////*/}
                <FormControl mb={5}>
                    {/*<FormLabel>앨범 이미지 URL</FormLabel>*/}
                    {/*<Input*/}
                    {/*    type="file"*/}
                    {/*    accept="image/*"*/}
                    {/*    multiple*/}
                    {/*    onChange={(e) => setUploadFiles(e.target.files)}*/}
                    {/*/>*/}
                    {/*-------위 코드는 이미지 파일 저장 형식의 코드, 아래 주석처리된 코드는 이미지url저장 방식 - 백엔드도 수정해야 하므로 주석 처리 -jeon602*/}
                    <Input value={imageURl}
                    onChange={(e)=> setImageURL(e.target.value)}
                    placeholder="이미지 url을 입력하세요"></Input>
                    <FormHelperText color="red">
                        한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부 가능합니다.
                    </FormHelperText>
                </FormControl>

                <FormControl mb={5}>
                    <FormLabel>Album Title</FormLabel>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </FormControl>
                {/*================================*/}
                <FormControl mb={5}>
                    <FormLabel>Artist</FormLabel>
                    <Input value={artist} onChange={(e) => setArtist(e.target.value)}/>
                </FormControl>
                {/*======================================*/}

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
                    <FormLabel></FormLabel>
                    <Input value={agency}
                           onChange={(e) => setAgency(e.target.value)}
                           placeholder="해당 앨범의 발매회사를 입력해주세요"/>

                </FormControl>


                {/*-------------------------가격 입력란----------*/}
                {/*<FormControl mb={5}>*/}
                {/*    <FormLabel>Price</FormLabel>*/}
                {/*    <Input*/}
                {/*        value={price}*/}
                {/*        onChange={(e) => setPrice(e.target.value)}*/}
                {/*        type="number"*/}
                {/*        min="0"*/}
                {/*        h={"sm"}/>*/}
                {/*</FormControl>*/}
                {/*===============================================*/}


                {/*// 원화 기호를 사용한 가격 입력 폼*/}
                <FormControl mb={5}>
                    <FormLabel>가격</FormLabel>
                    <InputGroup>
                        <InputRightAddon children="₩" />
                        <Input
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          type="number"
                          min="0"
                        />
                    </InputGroup>
                </FormControl>
            </CardBody>

            <CardFooter>
                <Button
                    isDisabled={isSubmitting}
                    onClick={handleSubmit}
                    colorScheme="pink"
                >
                    저장
                </Button>
            </CardFooter>
        </Card>
    </Center>);
}
