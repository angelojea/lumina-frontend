import { Box, Button, Modal, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigator } from "../AppRouter";
import { FormInputControl } from "../form/form-control";
import { useZForm } from "../form/useForm";
import { projectSchema } from "../schemas/Project";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function ProjectDetail() {
  const navigate = useNavigator();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/projects", {
      method: "GET",
      credentials: "include",
    });
  }, []);

  const form = useZForm(projectSchema, {
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        navigate(-1);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={4}>
          <FormInputControl schema={projectSchema} form={form} field="name" />
          {/* <FormInputControl schema={projectSchema} form={form} field="description" /> */}
          <Stack direction={"row-reverse"} spacing={2}>
            <Button variant="contained" onClick={() => form.submitForm()} disabled={form.isValid}>
              Save
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
