import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { TableContainer } from "@mui/material";
import { Link } from "react-router-dom";

// Generate Order Data
function createData(id, dropCourse, addCourse) {
  return {id, dropCourse, addCourse};
}

const rows = [
  createData(1, 'CSCE 412', 'CSCE 482'),
  createData(2, 'MATH 151', 'POLS 207'),
  createData(3, 'CSCE 222', 'CSCE 221'),
  createData(4, 'CSCE 321', 'CSCE 654'),
  createData(5, 'CSCE 123', 'CSCE 456'),
];

export default function MyListings() {
  return (
      <React.Fragment>
        <Title>My Listings</Title>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      Drop <b>{row.dropCourse}</b> for <b>{row.addCourse}</b>
                    </TableCell>
                    <TableCell align="right">
                      {/* TODO: Modal logic here */}
                      <IconButton>
                        <EditIcon/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </React.Fragment>
  );
}