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
  Select,
  MenuItem,
  Checkbox,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  projectId: string;
  createdAt: string;
  done: boolean;
  project?: { id: string; name: string };
}

interface Project {
  id: string;
  name: string;
  status: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  async function fetchTasks() {
    try {
      const { data } = await axios.get('http://localhost:4000/tasks', {
        withCredentials: true,
      });
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas', error);
    }
  }

  async function fetchProjects() {
    try {
      const { data } = await axios.get('http://localhost:4000/projects', {
        withCredentials: true,
      });
      setProjects(data.filter((p: Project) => p.status !== 'canceled'));
    } catch (error) {
      console.error('Erro ao buscar projetos', error);
    }
  }

  async function handleCreateTask() {
    try {
      await axios.post(
        'http://localhost:4000/tasks',
        {
          title: newTaskTitle,
          projectId: newTaskProjectId,
        },
        { withCredentials: true },
      );
      setOpenCreate(false);
      setNewTaskTitle('');
      setNewTaskProjectId('');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao criar tarefa', error);
    }
  }

  async function handleUpdateTask(updated: {
    title: string;
    projectId: string;
  }) {
    if (!selectedTask) return;
    try {
      await axios.patch(
        `http://localhost:4000/tasks/${selectedTask.id}`,
        updated,
        { withCredentials: true },
      );
      setOpenEdit(false);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!window.confirm('Tem certeza que deseja excluir essa tarefa?')) return;
    try {
      await axios.delete(`http://localhost:4000/tasks/${taskId}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa', error);
    }
  }

  async function toggleDone(task: Task) {
    try {
      await axios.patch(
        `http://localhost:4000/tasks/${task.id}`,
        {
          done: !task.done,
        },
        { withCredentials: true },
      );
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa', error);
    }
  }

  return (
    <Stack>
      <Button
        variant="contained"
        onClick={() => setOpenCreate(true)}
        sx={{ mb: 2 }}
      >
        Nova Tarefa
      </Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Projeto</TableCell>
              <TableCell>Feito</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma tarefa cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              tasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.project?.name || 'Nenhum'}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={task.done}
                        onChange={() => toggleDone(task)}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <IconButton
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenView(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTask(task.id)}
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
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
      />

      {/* Modal Criar Tarefa */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Nova Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Título"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Select
            fullWidth
            margin="dense"
            value={newTaskProjectId}
            onChange={(e) => setNewTaskProjectId(e.target.value)}
            displayEmpty
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button onClick={handleCreateTask} variant="contained">
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Visualizar Tarefa */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Detalhes da Tarefa</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Nome:</strong> {selectedTask?.title}
          </Typography>
          <Typography>
            <strong>Projeto:</strong> {selectedTask?.project?.name || 'Nenhum'}
          </Typography>
          <Typography>
            <strong>Data de Criação:</strong>{' '}
            {selectedTask
              ? new Date(selectedTask.createdAt).toLocaleString()
              : ''}
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Tarefa */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Título"
            value={selectedTask?.title || ''}
            onChange={(e) =>
              setSelectedTask((prev) =>
                prev ? { ...prev, title: e.target.value } : prev,
              )
            }
          />
          <Select
            fullWidth
            margin="dense"
            value={selectedTask?.projectId || ''}
            onChange={(e) =>
              setSelectedTask((prev) =>
                prev ? { ...prev, projectId: e.target.value } : prev,
              )
            }
            displayEmpty
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button
            onClick={() =>
              selectedTask &&
              handleUpdateTask({
                title: selectedTask.title,
                projectId: selectedTask.projectId,
              })
            }
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
