import {
  Box,
  list,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberList() {
  const [list, setList] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/member/list").then((response) => setList(response.data));
  }, []);
  if (list === null) {
    return <Spinner />;
  }
  function handleTableRowClick(id) {
    const params = new URLSearchParams();
    params.set("id", id);
    navigate("/member?" + params.toString());
  }
  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>logId</Th>
            <Th>name</Th>
            <Th>email</Th>
            <Th>address</Th>
            <Th>age</Th>
            <Th>gender</Th>
            <Th>role</Th>
            <Th>joinDate</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (
            <Tr
              _hover={{ cursor: "pointer" }}
              key={member.logId}
              onClick={() => handleTableRowClick(member.logId)}
            >
              <Td>{member.logId}</Td>
              <Td>{member.name}</Td>
              <Td>{member.email}</Td>
              <Td>{member.address}</Td>
              <Td>{member.age}</Td>
              <Td>{member.gender}</Td>
              <Td>{member.role}</Td>
              <Td>{member.joinDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
