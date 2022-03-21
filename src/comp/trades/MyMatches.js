import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, dropCourse, addCourse) {
  return { id, dropCourse, addCourse };
}

const rows = [
  createData(
      1,
      'CSCE 121',
      'MATH 152'
  ),
  createData(
      2,
      'MATH 304',
      'MATH 251'
  ),
  createData(
      3,
      'CSCE 421',
      'CSCE 420'
  ),
];

export default function Orders() {
  return (
      <React.Fragment>
        <Title>My Matches</Title>
        <Table size="medium">
          <TableBody>
            {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>Drop <b>{row.dropCourse}</b> for <b>{row.addCourse}</b></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
  );
}