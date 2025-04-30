import { Stack, TextField } from "@mui/material";
import { InferType, ObjectSchema } from "yup";

type FormInputControlProps<TIn extends ObjectSchema<any>> = {
  schema: TIn;
  field: keyof InferType<TIn>;
  form: any;
  label?: string;
  disabled?: boolean;
  options?: { id: string; value: string }[];
  onChange?: (props: any) => any;
};

export function FormInputControl<TIn extends ObjectSchema<any>>({
  schema,
  field,
  form,
  disabled,
  label,
  onChange,
}: FormInputControlProps<TIn>) {
  const fieldObj = schema.fields[field] as ObjectSchema<TIn>;

  let rows: number | undefined = undefined;
  if (fieldObj.meta()?.rows) {
    rows = fieldObj.meta()?.rows;
  }

  const { select, options } = fieldObj.meta() || {};

  return (
    <>
      <Stack>
        <TextField
          id={String(field)}
          variant="outlined"
          onChange={(ev) => {
            form.setFieldValue(field, ev.target.value);
            form.handleChange(ev);
            if (onChange) onChange(ev.target.value);
          }}
          onBlur={form.handleBlur}
          disabled={disabled}
          {...(label || fieldObj.spec.label ? { label: fieldObj.spec.label } : {})}
          {...(rows ? { rows: rows, multiline: true } : {})}
          {...(Boolean(form.touched[field]) && Boolean(form.errors[field])
            ? { error: true, helperText: form.errors[field] }
            : {})}
        />
      </Stack>
    </>
  );
}
