import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Checkbox,
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  done: boolean;
  projectId: string | null;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  } | null;
}

interface Project {
  id: string;
  name: string;
  status: string; // Corrigido
}

const columns = [
  { id: 'done', label: 'Done', minWidth: 50 },
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'project', label: 'Project', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 170 },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editProjectId, setEditProjectId] = useState('');

  const [selectedProjectId, setSelectedProjectId] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function fetchProjects() {
    try {
      const response = await axios.get('http://localhost:4000/projects', {
        withCredentials: true,
      });
      const filteredProjects = response.data.filter(
        (p: Project) => p.status !== 'canceled',
      );
      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/tasks', {
        params: selectedProjectId ? { projectId: selectedProjectId } : {},
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas', error);
      setTasks([]);
    }
  };

  async function handleCreateTask() {
    try {
      await axios.post(
        'http://localhost:4000/tasks',
        {
          title: newTaskTitle,
          projectId: newTaskProjectId || null,
        },
        { withCredentials: true },
      );
      setNewTaskTitle('');
      setNewTaskProjectId('');
      setOpenCreate(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task', error);
      alert('Error creating task');
    }
  }

  async function handleUpdateTask() {
    if (!selectedTask) return;
    try {
      await axios.patch(
        `http://localhost:4000/tasks/${selectedTask.id}`,
        {
          title: editTitle,
          projectId: editProjectId || null,
        },
        { withCredentials: true },
      );
      setOpenEdit(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  }

  async function handleToggleDone(task: Task) {
    try {
      await axios.patch(
        `http://localhost:4000/tasks/${task.id}`,
        { done: !task.done },
        { withCredentials: true },
      );
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task', error);
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  }

  function openEditDialog(task: Task) {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditProjectId(task.projectId || '');
    setOpenEdit(true);
  }

  function openDetailsDialog(task: Task) {
    setSelectedTask(task);
    setOpenDetails(true);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId]);

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreate(true)}
      >
        New Task
      </Button>

      <Select
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">All Projects</MenuItem>
        {projects.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task) => (
                  <TableRow hover key={task.id}>
                    <TableCell>
                      <Checkbox
                        checked={task.done}
                        onChange={() => handleToggleDone(task)}
                      />
                    </TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.project?.name || 'None'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="default"
                          onClick={() => openDetailsDialog(task)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => openEditDialog(task)}
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
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Create */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="standard"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Select
            value={newTaskProjectId}
            onChange={(e) => setNewTaskProjectId(e.target.value)}
            fullWidth
            displayEmpty
            variant="standard"
          >
            <MenuItem value="">None</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Task Title"
            fullWidth
            variant="standard"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Select
            value={editProjectId}
            onChange={(e) => setEditProjectId(e.target.value)}
            fullWidth
            variant="standard"
            displayEmpty
          >
            <MenuItem value="">None</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateTask}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Details */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          <p>
            <strong>Title:</strong> {selectedTask?.title}
          </p>
          <p>
            <strong>Project:</strong> {selectedTask?.project?.name || 'None'}
          </p>
          <p>
            <strong>Created at:</strong> {selectedTask?.createdAt}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
