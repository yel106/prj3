import { Button, Input, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export function OrderWrite() {
  const [name, setName] = useState("");
  const toast = useToast();
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(10000); // 가정된 아이템 가격
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  function getMember() {
    axios
      .get("/api/order", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log("getMember()의 then 실행");
        // setMember(response.data);
        const memberData = response.data;
        setName(memberData.name); // 예: 응답에서 'name' 필드 사용
        setAddress(memberData.address); // 예: 응답에서 'address' 필드 사용
        setEmail(memberData.email); // 예: 응답에서 'email' 필드 사용
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("getMember()의 catch 실행");
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response.status === 403) {
          console.log("403에러");
        } else {
          console.log("그 외 에러");
        }
      });
  }
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
        getMember();
      })
      .catch((error) => {
        console.log("sendRefreshToken()의 catch 실행");
        localStorage.removeItem("refreshToken");
        //navigate("/login");
        toast({
          description: "권한이 없습니다",
          status: "warning",
        });
      });
  }
  useEffect(() => {
    getMember();
  }, []);

  const handleSubmit = async () => {
    try {
      // 요청을 위한 데이터 생성
      const requestData = {
        orderId: nanoid(),
        orderName: "아이템 일부 이름", // 실제 아이템 이름의 일부를 사용
        amount: quantity * itemPrice,
        // 나머지 필요한 데이터
        name,
        address,
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
      const response = await axios.post("/payment/toss", serverData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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
        placeholder="이름"
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