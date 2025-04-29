import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigator } from "../AppRouter";
import { generateId } from "../utils/functions";

interface Column {
  id: "id" | "name" | "projectId" | "status" | "actions";
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  element?: any;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "projectId",
    label: "ProjectId",
    minWidth: 170,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 170,
  },
];

interface Row {
  id: string;
  name: string;
  projectId: number;
  status: string;
  actions?: ReactNode;
}

export function TaskList() {
  const navigate = useNavigator();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(name: string, projectId: number, status: string): Row {
    return {
      id: generateId(),
      name,
      projectId,
      status,
      actions: (
        <Stack direction={"row"}>
          <IconButton color="default" type="button">
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" type="button">
            <EditIcon />
          </IconButton>
          <IconButton color="error" type="button">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    };
  }
  const rows = [
    createData("Projecto 1", 1324171354, "3287263"),
    createData("Projecto 2", 1403500365, "9596961"),
    createData("Projecto 13", 60483973, "301340"),
  ];

  return (
    <Stack>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Outlet />
    </Stack>
  );
}
