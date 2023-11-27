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
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MemberSignup() {
  const [logId, setLogId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstDigit, setFirstDigit] = useState("");
  const [role, setRole] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [emailAvailable, setEmailAvailable] = useState(false);
  let sameOriginEmail = false;
  let emailChecked = sameOriginEmail || emailAvailable;
  const [idAvailable, setIdAvailable] = useState(false);
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
        role,
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
    <Box>
      <Card>
        <CardHeader>
          <Heading>회원 가입</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <FormLabel>logId</FormLabel>
            <Flex>
              <Input
                value={logId}
                onChange={(e) => {
                  setLogId(e.target.value);
                  setIdAvailable(false);
                }}
              />
              <Button isDisabled={idChecked} onClick={handleIdCheck}>
                중복확인
              </Button>
            </Flex>
          </FormControl>
          <FormControl>
            <FormLabel>password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>email</FormLabel>
            <Flex>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailAvailable(false);
                }}
              />
              <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
                중복확인
              </Button>
            </Flex>
          </FormControl>
          <FormControl>
            <FormLabel>name</FormLabel>
            <Flex>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Flex>
          </FormControl>
          <FormControl>
            <FormLabel>address</FormLabel>
            <Flex>
              <Input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Flex>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="birth-date">생년월일</FormLabel>
            <Input
              id="birth-date"
              type="text"
              placeholder="YYMMDD"
              maxLength={6}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel htmlFor="first-digit">
              주민등록번호 뒷자리 첫 번째 숫자
            </FormLabel>
            <Input
              id="first-digit"
              type="text"
              placeholder="1"
              maxLength={1}
              value={firstDigit}
              onChange={(e) => setFirstDigit(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="role">역할</FormLabel>
            <Select
              id="role"
              placeholder="역할 선택"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">관리자</option>
              <option value="USER">사용자</option>
            </Select>
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button onClick={handleSubmit} colorScheme="blue">
            가입
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
}
