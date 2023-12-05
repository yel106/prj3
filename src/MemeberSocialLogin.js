import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export function MemeberSocialLogin() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(`/api/auth/KAKAO/callback?` + searchParams)
      .then((response) => console.log(response.data));
  }, []);

  return null;
}
