import { Box, Button, Modal, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigator } from '../AppRouter';
import { useLoading } from '../contexts/LoadingContext';
import { FormInputControl } from '../form/form-control';
import { useZForm } from '../form/useForm';
import { taskSchema } from '../schemas/Task';
import { getTask } from '../services/Task.service';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function TaskDetail() {
  const navigate = useNavigator();
  const [isOpen, setIsOpen] = useState(true);
  const { id } = useParams();
  const { setLoading } = useLoading();
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    (async () => {
      if (!id || id == 'new') return;

      setLoading(true);
      try {
        const task = await getTask(id!);
        form.setValues(task);
      } catch (error) {}
      setLoading(false);
    })();
  }, []);

  const close = () => {
    setIsOpen(false);
    navigate(-1);
  };

  const form = useZForm(taskSchema, {
    onSubmit: async (values) => {
      const isNew = id === 'new';
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/tasks${isNew ? '' : '/' + id}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: isNew ? 'POST' : 'PATCH',
          credentials: 'include',
          body: JSON.stringify(values),
        },
      );
      close();
    },
  });

  return (
    <Modal
      open={isOpen}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={4}>
          <FormInputControl
            schema={taskSchema}
            form={form}
            field="name"
            disabled={state?.readonly}
          />
          <FormInputControl
            schema={taskSchema}
            form={form}
            field="description"
            disabled={state?.readonly}
          />
          <Stack direction={'row-reverse'} spacing={2}>
            <Button
              type="submit"
              variant="contained"
              onClick={form.submitForm}
              disabled={!form.dirty || !form.isValid}
            >
              Save
            </Button>
            <Button onClick={close}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
