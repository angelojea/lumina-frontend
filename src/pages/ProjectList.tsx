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
  MenuItem,
  Select,
} from '@mui/material';
import { ReactNode, useState, useEffect } from 'react';
import { useNavigator } from '../AppRouter';
import axios from 'axios';

interface Column {
  id: 'name' | 'projectId' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'projectId', label: 'ProjectId', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 170 },
];

interface Row {
  id: string;
  name: string;
  projectId: string;
  status: string;
}

export function ProjectList() {
  const navigate = useNavigator();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [projects, setProjects] = useState<Row[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Row | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(
    null,
  );
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectStatus, setEditProjectStatus] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:4000/projects', {
        withCredentials: true,
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Erro ao buscar projetos', error);
      setProjects([]);
    }
  };

  const handleCreateProject = async () => {
    try {
      await axios.post(
        'http://localhost:4000/projects',
        { name: newProjectName },
        { withCredentials: true },
      );
      setNewProjectName('');
      setOpenCreate(false);
      fetchProjects();
    } catch (error) {
      console.error('Erro ao criar projeto', error);
      alert('Erro ao criar projeto');
    }
  };

  function handleViewProject(id: string) {
    // Aqui depois você pode navegar para a página de detalhes!
    //navigate(`/projects/${id}`);
  }

  function handleEditProject(project: any) {
    setSelectedProject(project);
    setEditOpen(true);
  }

  function openDeleteDialog(id: string) {
    setProjectToDeleteId(id);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteProject() {
    if (projectToDeleteId) {
      try {
        await axios.delete(
          `http://localhost:4000/projects/${projectToDeleteId}`,
          {
            withCredentials: true,
          },
        );
        setDeleteDialogOpen(false);
        setProjectToDeleteId(null);
        fetchProjects();
      } catch (error) {
        console.error('Erro ao excluir projeto', error);
      }
    }
  }

  async function handleUpdateProject() {
    if (!selectedProject) return;
    try {
      await axios.patch(
        `http://localhost:4000/projects/${selectedProject.id}`,
        {
          name: selectedProject.name,
          status: selectedProject.status,
        },
        { withCredentials: true },
      );
      alert('Projeto atualizado com sucesso!');
      setEditOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Erro ao atualizar projeto', error);
    }
  }

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'new':
        return ['canceled', 'in progress'];
      case 'in progress':
        return ['paused', 'concluded', 'canceled'];
      case 'paused':
        return ['in progress', 'canceled'];
      case 'concluded':
        return ['in progress'];
      case 'canceled':
        return ['in progress'];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Stack>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreate(true)}
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
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Nenhum projeto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              projects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((project) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={project.id}
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <IconButton
                          color="default"
                          type="button"
                          onClick={() => handleViewProject(project.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedProject(project);
                            setEditProjectName(project.name);
                            setEditProjectStatus(project.status);
                            setEditOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(project.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={projects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Criar */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
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
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            color="primary"
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Editar Projeto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Projeto"
            fullWidth
            variant="standard"
            value={selectedProject?.name || ''}
            onChange={(e) =>
              setSelectedProject((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <Select
            margin="dense"
            fullWidth
            variant="standard"
            value={selectedProject?.status || ''}
            onChange={(e) =>
              setSelectedProject((prev: any) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            displayEmpty
          >
            {selectedProject?.status && (
              <MenuItem
                key={selectedProject.status}
                value={selectedProject.status}
              >
                {selectedProject.status} (Atual)
              </MenuItem>
            )}
            {getNextStatusOptions(selectedProject?.status || '').map(
              (statusOption) => (
                <MenuItem key={statusOption} value={statusOption}>
                  {statusOption}
                </MenuItem>
              ),
            )}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleUpdateProject}
            variant="contained"
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este projeto?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteProject}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
