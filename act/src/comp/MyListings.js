import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Generate Order Data
function createData(id, dropCourse, addCourse) {
  return { id, dropCourse, addCourse };
}

const rows = [
  createData(
      1,
      'CSCE 412',
      'CSCE 482'
  ),
  createData(
      2,
      'MATH 151',
      'POLS 207'
  ),
  createData(
      3,
      'CSCE 222',
      'CSCE 221'
  ),
];

export default function Orders() {
  return (
      <React.Fragment>
        <Title>My Listings</Title>
        <Table size="medium">
          <TableBody>
            {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    Drop <b>{row.dropCourse}</b> for <b>{row.addCourse}</b>
                    <IconButton aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>

      </React.Fragment>
  );
}