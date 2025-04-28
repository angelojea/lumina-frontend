import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { useNavigator } from '../AppRouter';
import axios from 'axios';

interface Column {
  id: 'id' | 'name' | 'projectId' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  element?: any;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  {
    id: 'projectId',
    label: 'ProjectId',
    minWidth: 170,
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
  },
  {
    id: 'actions',
    label: 'Actions',
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

function generateId(length = 8) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function ProjectList() {
  const navigate = useNavigator();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
        <Stack direction={'row'}>
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
    createData('Projecto 1', 1324171354, '3287263'),
    createData('Projecto 2', 1403500365, '9596961'),
    createData('Projecto 13', 60483973, '301340'),
  ];

  async function handleCreateProject() {
    try {
      await axios.post(
        'http://localhost:4000/projects',
        { name: newProjectName },
        { withCredentials: true },
      );
      alert('Projeto criado com sucesso!');
      setOpen(false);
      setNewProjectName('');
      // Aqui seria legal atualizar a lista automaticamente
    } catch (error) {
      console.error('Erro ao criar projeto', error);
      alert('Erro ao criar projeto');
    }
  }

  return (
    <Stack>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Novo Projeto
      </Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Criar Novo Projeto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Projeto"
            fullWidth
            variant="standard"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            color="primary"
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
