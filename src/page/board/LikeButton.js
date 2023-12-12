// import React, { useEffect, useState } from "react";
// import { Button } from "@chakra-ui/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
//
// export function LikeButton() {
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//
//   const handleLikeClick = () => {
//     setLiked((prevLiked) => !prevLiked);
//     setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
//   };
//
//   return (
//     <Button
//       w={"40%"}
//       onClick={handleLikeClick}
//       colorScheme={liked ? "pink" : "gray"}
//     >
//       <FontAwesomeIcon icon={faHeart} style={{ color: "#db7093" }} />
//       {likeCount}
//     </Button>
//   );
// }
