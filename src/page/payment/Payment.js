import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { Button, useQuery } from "@chakra-ui/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const clientKey = "test_ck_QbgMGZzorzz0oMebq4lvrl5E1em4";
const customerKey = nanoid();
const selector = "#payment-widget";
export function Payment() {
  const location = useLocation();
  const {
    paymentUid,
    paymentName,
    customerName,
    address,
    quantity,
    amount,
    customerEmail,
  } = location.state;
  console.log(location.state);

  const paymentWidget = usePaymentWidget(clientKey, customerKey);
  // const paymentWidget = usePaymentWidget(clientKey, ANONYMOUS); // 비회원 결제
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(amount);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
      if (paymentWidget == null) {
        return;
      }
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        selector,
        price,
        { variantKey: "DEFAULT" },
      );
      paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, [paymentWidget]);
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) {
      return;
    }
    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON,
    );
  }, [price]);
  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-widget" />
        <div id="agreement" />
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            <label
              htmlFor="coupon-box"
              className="checkable__label typography--regular"
            >
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                onChange={(event) => {
                  setPrice(
                    event.target.checked ? price - 5_000 : price + 5_000,
                  );
                }}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>
        <div className="result wrapper">
          <Button
            onClick={async () => {
              const paymentWidget = paymentWidgetRef.current;
              try {
                await paymentWidget?.requestPayment({
                  orderId: paymentUid,
                  orderName: paymentName,
                  customerName: customerName,
                  customerEmail: customerEmail,
                  successUrl: `${window.location.origin}/success`,
                  failUrl: `${window.location.origin}/fail`,
                });
              } catch (err) {
                console.log(err);
              }
            }}
          >
            결제하기
          </Button>
        </div>
      </div>
    </div>
    // <div>
    //   <h1>주문서</h1>
    //   <div id="payment-widget"></div>
    //   <div>
    //     <Checkbox
    //       borderColor="black"
    //       borderWidth="2px"
    //       mt={1}
    //       onChange={(event) => {
    //         // 여기에 updateAmount할 예정
    //         setPrice(event.target.checked ? price - 5_000 : price + 5_000);
    //       }}
    //     />
    //     <label>5,000월 할인 쿠폰 적용</label>
    //   </div>
    //   <Button
    //     onClick={async () => {
    //       const paymentWidget = paymentWidgetRef.current;
    //       try {
    //         await paymentWidget?.requestPayment({
    //           orderId: nanoid(),
    //           orderName: "토스 티셔츠 외 2건",
    //           customerName: "김토스",
    //           customerEmail: "customer123@gmail.com",
    //           successUrl: `${window.location.origin}/success`,
    //           failUrl: `${window.location.origin}/fail`,
    //         });
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     }}
    //   >
    //     결제하기
    //   </Button>
    // </div>
  );
}

function usePaymentWidget(clientKey, customerKey) {
  return useQuery({
    queryKey: ["payment-widget", clientKey, customerKey],
    queryFn: () => {
      // ------  결제위젯 초기화 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
      return loadPaymentWidget(clientKey, customerKey);
    },
  });
}
export default Payment;
