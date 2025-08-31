import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';

import type { IDebateSummary } from './view';

// ----------------------------------------------------------------------

type Props = {
  row: IDebateSummary;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  return (
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
              {row.name}
            </Link>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.start_time}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
        {row.applicants_count}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.role === 'announced' && 'primary') ||
            (row.role === 'teamsConfirmed' && 'info') ||
            (row.role === 'playersConfirmed' && 'secondary') ||
            'default'
          }
          // color={
          //   (row.role === 'announced' && 'success') ||
          //   (row.role === 'teamsConfirmed' && 'warning') ||
          //   (row.role === 'playersConfirmed' && 'banned') ||
          //   'default'
          // }
        >
          {row.role}
        </Label>
      </TableCell>
      {/* <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.role}</TableCell> */}

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'online' && 'success') ||
            (row.status === 'onsite' && 'warning') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
