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
  form,
  field,
  disabled,
  label,
  options: propsOpts,
  onChange,
}: FormInputControlProps<TIn>) {
  return <></>;
  //   const fieldObj = schema.fields[field] as ObjectSchema<TIn>;

  //   let rows: number | undefined = undefined;
  //   if (fieldObj.meta()?.rows) {
  //     rows = Number(fieldObj.meta()?.rows);
  //   }

  //   const { code: isCode, select, options } = fieldObj.meta() || {};

  //   return (
  //     <Stack gap="6px">
  //       <Field>
  //         {(label || fieldObj.spec.label) && (
  //           <Field.Label>{label || fieldObj.spec.label}:</Field.Label>
  //         )}

  //         {select ? (
  //           <Select
  //             name={String(field)}
  //             onChange={(e) => {
  //               const target = e.target as HTMLSelectElement;
  //               form.setFieldValue(field, target.value);
  //               if (onChange) onChange(target.value);
  //             }}
  //             onBlur={form.handleBlur}
  //           >
  //             {propsOpts
  //               ? propsOpts.map((opt) => (
  //                   <option value={opt.id}>{opt.value}</option>
  //                 ))
  //               : options
  //               ? options.map((opt: any) => (
  //                   <option value={opt.id}>{opt.value}</option>
  //                 ))
  //               : undefined}
  //           </Select>
  //         ) : isCode ? (
  //           <CodeEditor
  //             defaultValue={form.values[field] || fieldObj.getDefault()}
  //             onChange={(v) => {
  //               form.setFieldValue(field, v);

  //               if (onChange) onChange(v);
  //             }}
  //             height="50vh"
  //           />
  //         ) : rows ? (
  //           <Textarea
  //             name={String(field)}
  //             onChange={(ev) => {
  //               form.setFieldValue(field, ev.target.value);
  //               if (onChange) onChange(ev.target.value);
  //             }}
  //             onBlur={form.handleBlur}
  //             disabled={disabled}
  //             value={form.values[field]}
  //             rows={rows}
  //           />
  //         ) : (
  //           <Input
  //             name={String(field)}
  //             onChange={(ev) => {
  //               form.setFieldValue(field, ev.target.value);
  //               if (onChange) onChange(ev.target.value);
  //             }}
  //             onBlur={form.handleBlur}
  //             disabled={disabled}
  //             value={form.values[field]}
  //           />
  //         )}
  //       </Field>
  //       <SM style={{ color: PALETTE.red[500] }}>
  //         {Boolean(form.touched[field]) &&
  //           Boolean(form.errors[field]) &&
  //           form.errors[field]}
  //       </SM>
  //     </Stack>
  //   );
}
