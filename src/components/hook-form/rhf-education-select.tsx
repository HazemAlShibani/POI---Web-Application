import { Controller, useFormContext } from 'react-hook-form';

import { EducationSelect } from '../education-select';

import type { ReagionSelectProps } from '../reagion-select';

// ----------------------------------------------------------------------

export function RHFEducationSelect({
  name,
  helperText,
  ...other
}: ReagionSelectProps & {
  name: string;
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <EducationSelect
          id={`rhf-country-select-${name}`}
          value={field.value}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
