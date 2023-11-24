import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  useRadio,
  useRadioGroup
} from "@chakra-ui/react";
import {useState} from "react";
import axios from "axios";

function RadioCard(props) {
  const {getInputProps, getRadioProps} = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as='label'>
      <Input {...input}/>
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        _checked={{
          bg: 'blue.300',
          color: 'white',
          borderColor: 'blue.100',
        }}
        px={2}
        py={2}
        >
        {props.children}
      </Box>
    </Box>
  );
}

function RadioButtons({setPayment}) {
  const options = ['결제수단1', '결제수단2', '결제수단3'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: setPayment,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

export function OrderWrite(){
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [phone, setPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [payment, setPayment] = useState("");

  function handleSubmit() {
    axios.post("/api/order",{
      name, addr, phone, totalPrice, payment
    }).then(()=>{
      console.log(name);
      console.log(addr);
      console.log(phone);
      console.log(totalPrice);
      console.log(payment);
    }).catch((error)=>console.log(error))
      .finally(()=>console.log("end"));
  }

  return (
    <Box>
      <Flex>
        <Heading>배송 정보</Heading>
        <Button onClick={()=>{
          if(edit===false){
            setEdit(true);
        }else{
            setEdit(false);
          }
        }}>변경하기</Button>
      </Flex>
      <Text>이용자이름</Text>
      <Text>이용자주소</Text>
      <Text>이용자번호</Text>
      {edit && <Box>
      <FormControl>
        <FormLabel>이름</FormLabel>
        <Input value={name} onChange={e=>setName(e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>주소</FormLabel>
        <Input value={addr} onChange={e=>setAddr(e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>전화번호</FormLabel>
        <Input value={phone} onChange={e=>setPhone(e.target.value)}/>
      </FormControl>
      </Box>
      }
      <br/>
      <Heading>주문 정보</Heading>
    {/*  제품리스트  */}
    {/* 총 결제 금액 */}
      <FormControl>
        <FormLabel>총 결제 금액</FormLabel>
        <Input value={totalPrice} onChange={e=>setTotalPrice(e.target.value)}/>
      </FormControl>
    {/* 결제수단선택  */}
      <RadioButtons setPayment={setPayment}/>
      <Button onClick={handleSubmit}>
        결제하기
      </Button>
    </Box>
  );
}