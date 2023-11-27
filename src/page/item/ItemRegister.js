//상품 등록 페이지
import {useState} from "react";
import {useToast} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export function ItemRegister() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumFormat, setAlbumFormat] = useState("");
  const [price, setPrice] = useState("");
  const [agency, setAgency] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const toast= useToast();
  const navigate = useNavigate();
  return(
    <></>
  );
}