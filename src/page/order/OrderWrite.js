import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export function OrderWrite() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(10000); // 가정된 아이템 가격
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // 요청을 위한 데이터 생성
      const requestData = {
        orderId: nanoid(),
        orderName: "아이템 일부 이름", // 실제 아이템 이름의 일부를 사용
        amount: quantity * itemPrice,
        // 나머지 필요한 데이터
        email, // 사용자 이메일
        // ...
      };
      const serverData = {
        ...requestData,
        paymentUid: requestData.orderId,
        paymentName: requestData.orderName,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      };
      delete requestData.orderId;
      delete requestData.orderName;
      // 서버에 POST 요청 보내기
      const response = await axios.post("/payment/toss", serverData);

      //응답 데이터를 사용하여 Payment페이지로 넘기기
      navigate("/payment", {
        state: {
          ...response.data,
        },
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  };

  return (
    <div>
      <h1>주문 페이지</h1>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="주문자 이름"
      />
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="주소"
      />
      <Input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="수량"
        min="1"
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <Button onClick={handleSubmit}>주문하기</Button>
    </div>
  );
}
