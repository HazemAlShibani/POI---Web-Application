import { Controller, useFormContext } from 'react-hook-form';

import { CoachSelect } from '../coach-select';

import type { ReagionSelectProps } from '../reagion-select';

// ----------------------------------------------------------------------

export function RHFCoachSelect({
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
        <CoachSelect
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
