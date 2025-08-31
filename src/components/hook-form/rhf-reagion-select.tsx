import { Controller, useFormContext } from 'react-hook-form';

import { ReagionSelect } from '../reagion-select';

import type { ReagionSelectProps } from '../reagion-select';

// ----------------------------------------------------------------------

export function RHFReagionSelect({
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
        <ReagionSelect
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
