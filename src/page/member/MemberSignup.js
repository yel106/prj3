import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
// import axiosInstance from "../../axiosInstance";

export function MemberSignup() {
  const [logId, setLogId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstDigit, setFirstDigit] = useState("");
  const [role, setRole] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  let sameOriginEmail = false;
  let emailChecked = sameOriginEmail || emailAvailable;
  let sameOriginId = false;
  let idChecked = sameOriginId || idAvailable;

  function handleSubmit() {
    axios
      .post("/member/add", {
        logId,
        password,
        email,
        name,
        address,
        birthDate: parseInt(birthDate, 10),
        firstDigit: parseInt(firstDigit, 10),
        // gender: role,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            description: "입력값을 확인해주세요",
            status: "error",
          });
        }
        toast({
          description: "가입중에 오류가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => console.log("done"));
  }
  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);
    axios
      .get("/member/check", {
        params: params,
      })
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  function handleIdCheck() {
    const params = new URLSearchParams();
    params.set("logId", logId);
    axios
      .get("/member/check", {
        params: params,
      })
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "이미 사용 중인 Id입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 Id입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box p={10} borderRadius={10} mt={5} w="60%" ml="20%">
      <Card>
        <CardHeader>
          <Heading textAlign="center" mb={10}>
            회원 가입
          </Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            {/*<FormLabel>아이디</FormLabel>*/}
            <Flex>
              <Input
                maxWidth={300}
                mb={5}
                mr={2}
                value={logId}
                placeholder="아이디"
                onChange={(e) => {
                  setLogId(e.target.value);
                  setIdAvailable(false);
                }}
              />
              <Button
                isDisabled={idChecked}
                onClick={handleIdCheck}
                backgroundColor="grey"
                color="white"
              >
                중복확인
              </Button>
            </Flex>
          </FormControl>
          <FormControl>
            <Flex>
              {/*<FormLabel>비밀번호</FormLabel>*/}
              <Input
                maxWidth={300}
                mb={5}
                mr={3}
                type="password"
                value={password}
                placeholder="비밀번호"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Tooltip
                background="grey"
                color="white"
                placement="auto-end"
                fontSize="md"
                label="비밀번호는 특수문자를 포함해야합니다."
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
              </Tooltip>
            </Flex>
            <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
          </FormControl>
          <FormControl>
            {/*<FormLabel>이메일</FormLabel>*/}
            <Flex>
              <Input
                maxWidth={300}
                mb={5}
                mr={2}
                type="email"
                value={email}
                placeholder="이메일"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailAvailable(false);
                }}
              />
              <Button
                isDisabled={emailChecked}
                onClick={handleEmailCheck}
                backgroundColor="grey"
                color="white"
              >
                중복확인
              </Button>
            </Flex>
          </FormControl>
          <FormControl>
            {/*<FormLabel>이름</FormLabel>*/}
            <Flex>
              <Input
                maxWidth={300}
                mb={5}
                value={name}
                placeholder="이름"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Flex>
          </FormControl>
          <FormControl>
            {/*<FormLabel>주소</FormLabel>*/}
            <Flex>
              <Input
                maxWidth={600}
                mb={5}
                value={address}
                placeholder="주소"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Flex>
          </FormControl>

          <FormControl isRequired>
            {/*<FormLabel htmlFor="birth-date">생년월일</FormLabel>*/}
            <Input
              id="birth-date"
              type="text"
              placeholder="생년월일               예) 971102"
              maxLength={6}
              maxWidth={300}
              mb={3}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            {/*<FormLabel htmlFor="first-digit">*/}
            {/*  주민등록번호 뒷자리 첫 번째 숫자*/}
            {/*</FormLabel>*/}
            <Input
              id="first-digit"
              type="text"
              placeholder="주민등록번호 뒷자리 첫 번째 숫자"
              maxLength={1}
              maxWidth={300}
              value={firstDigit}
              onChange={(e) => setFirstDigit(e.target.value)}
            />
          </FormControl>
          {/*<FormControl isRequired>*/}
          {/*  <FormLabel htmlFor="role">역할</FormLabel>*/}
          {/*  <Select*/}
          {/*    id="role"*/}
          {/*    placeholder="역할 선택"*/}
          {/*    value={role}*/}
          {/*    onChange={(e) => setRole(e.target.value)}*/}
          {/*  >*/}
          {/*    <option value="ROLE_ADMIN">관리자</option>*/}
          {/*    <option value="ROLE_USER">사용자</option>*/}
          {/*  </Select>*/}
          {/*</FormControl>*/}
        </CardBody>

        <CardFooter>
          <Button
            onClick={handleSubmit}
            backgroundColor="grey"
            color="white"
            width="300px"
          >
            회원 가입
          </Button>
        </CardFooter>
      </Card>
      <Spacer h={50} />
    </Box>
  );
}
