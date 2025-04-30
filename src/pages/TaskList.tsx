import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  IconButton,
  SpeedDial,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { RouterPaths, useNavigator } from "../AppRouter";
import { useLoading } from "../contexts/LoadingContext";
import { Task } from "../schemas/Task";
import { deleteTask, listTasks } from "../services/Task.service";

interface Column {
  id: "id" | "name" | "actions";
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  element?: any;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "actions",
    label: "Actions",
    minWidth: 170,
  },
];

interface Row {
  id: string;
  name: string;
}

export function TaskList() {
  const navigate = useNavigator();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [flag, setFlag] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Task[]>([]);
  const { setLoading } = useLoading();

  const refresh = () => setFlag(!flag);

  useEffect(() => {
    (async () => {
      const route: RouterPaths = "/tasks";
      if (location.pathname !== route) return;

      setLoading(true);
      try {
        setRows(await listTasks());
      } catch (error) {}
      setLoading(false);
    })();
  }, [location, flag]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                  {columns.map((column, i) => {
                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id}>
                          <Stack direction={"row"}>
                            <IconButton
                              color="default"
                              type="button"
                              onClick={() => {
                                navigate(row.id as RouterPaths, { readonly: true });
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton color="primary" type="button">
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              type="button"
                              onClick={async () => {
                                if (!window.confirm("You sure?")) return;
                                setLoading(true);
                                try {
                                  await deleteTask(row.id);
                                } catch (error) {}
                                setLoading(false);
                                refresh();
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      );
                    }

                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {i === 0 ? <Link to={row.id}>{value}</Link> : <>{value}</>}
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
      <Tooltip title="New Task" placement="left">
        <SpeedDial
          ariaLabel="New Record"
          sx={{ position: "absolute", bottom: 32, right: 32 }}
          icon={<AddIcon />}
          onClick={() => navigate("/tasks/new")}
        />
      </Tooltip>
      <Outlet />
    </Stack>
  );
}
