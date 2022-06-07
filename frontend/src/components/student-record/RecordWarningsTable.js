import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from "@mui/material/Paper";

const RecordWarningsTable = ({ recordWarnings }) => {
  return (
    <>
      {
        recordWarnings && recordWarnings.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warning</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sem</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recordWarnings.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.err}</TableCell>
                    <TableCell>{row.course ? row.course : '-'}</TableCell>
                    <TableCell>{row.sem ? row.sem : '-'}</TableCell>
                    <TableCell>{row.year ? row.year : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null
      }
    </>
  )
}

export default RecordWarningsTable;