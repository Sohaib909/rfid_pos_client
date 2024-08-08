import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { AddCircle, RemoveCircle, DeleteRounded, Edit } from '@mui/icons-material';

// ----------------------------------------------------------------------

export default function MTableRow({
  selected,
  rowLabel,
  handleClick,
  isSalesDashboard = false,
  handleQuantityChange,
  removeData
}) {
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {
          isSalesDashboard ? null : (
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={handleClick} />
          </TableCell>
        )}
        {rowLabel.map((rowCell, index) => (
          rowCell.profileSection ? (
            <TableCell  key={index}component="th" scope="row" padding="none">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt="" src={rowCell.avatarUrl} />
                <Typography variant="subtitle2" noWrap>
                  {rowCell.name}
                </Typography>
              </Stack>
            </TableCell>
          ) : isSalesDashboard && rowCell.label === "Quantity" ? (
            <TableCell key={index}>
              <IconButton
                style={{ color: 'red'}}  
                onClick={() => handleQuantityChange(-1)}
              >
                <RemoveCircle />
              </IconButton>
                {rowCell.value}
              <IconButton
                style={{ color: 'limegreen'}}  
                onClick={() => handleQuantityChange(1)}
              >
                <AddCircle />
              </IconButton>
            </TableCell>
          ) : (
            <TableCell key={index}>{rowCell.value}</TableCell>
          )
        ))}
        <TableCell style={{ textAlign: 'center'}} >
          { !isSalesDashboard ? (
            <IconButton>
              <Edit />
            </IconButton>
          ) : null}
          <IconButton 
            style={{ color: 'red'}} 
            onClick={removeData}
          >
            <DeleteRounded />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}

MTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  isSalesDashboard: PropTypes.bool,
  handleQuantityChange: PropTypes.func,
  removeData: PropTypes.func
};
