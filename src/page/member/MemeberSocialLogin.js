import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

export function MemeberSocialLogin() {
  let { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/auth/${type}/callback?` + searchParams)
      .then(() => navigate("/"));
  }, []);

  return null;
}
