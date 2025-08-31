import type {
  AutocompleteProps,
  AutocompleteRenderInputParams,
  AutocompleteRenderGetTagProps,
} from '@mui/material/Autocomplete';

import { useQuery } from '@tanstack/react-query';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { filledInputClasses } from '@mui/material/FilledInput';

import { getcoachData } from 'src/apis';

import { FlagIcon, iconifyClasses } from 'src/components/iconify';

import { getFaculty, displayValueByFacultyCode } from './utils';

// ----------------------------------------------------------------------

type Value = string;

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  'options' | 'renderOption' | 'renderInput' | 'renderTags' | 'getOptionLabel'
>;

export type ReagionSelectProps = AutocompleteBaseProps & {
  label?: string;
  error?: boolean;
  placeholder?: string;
  hiddenLabel?: boolean;
  getValue?: 'label' | 'code';
  helperText?: React.ReactNode;
};

export type FacultyType =
  | {
      code: string;
      label: string;
    }
  | undefined;

export function CoachSelect({
  id,
  label,
  error,
  multiple,
  helperText,
  hiddenLabel,
  placeholder,
  getValue = 'label',
  ...other
}: ReagionSelectProps) {
  const { data: facultydata } = useQuery({
    queryKey: ['get-couch-data'],
    queryFn: () => getcoachData(),
    select: (data) => {
      const mapped = data.map((item) => ({
        code: `${item.profile.id}`,
        label: `${item.profile.first_name} ${item.profile.last_name}`,
      }));

      return mapped;
    },
  });

  const options = facultydata || [];

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: FacultyType) => {
    const country = getFaculty(option, facultydata as FacultyType[]);

    if (!country.label) {
      return null;
    }

    return (
      <li {...props} key={country.label}>
        {country.label}
      </li>
    );
  };

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const country = getFaculty(
      params.inputProps.value as FacultyType,
      facultydata as FacultyType[]
    );

    const baseField = {
      ...params,
      label,
      placeholder,
      helperText,
      hiddenLabel,
      error: !!error,
      inputProps: {
        ...params.inputProps,
        autoComplete: 'new-password',
      },
    };

    if (multiple) {
      return <TextField {...baseField} />;
    }

    return (
      <TextField
        {...baseField}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start" sx={{ ...(!country.code && { display: 'none' }) }} />
          ),
        }}
        sx={{
          ...(!hiddenLabel && {
            [`& .${filledInputClasses.root}`]: { [`& .${iconifyClasses.root}`]: { mt: -2 } },
          }),
        }}
      />
    );
  };

  const renderTags = (selected: FacultyType[], getTagProps: AutocompleteRenderGetTagProps) =>
    selected.map((option, index) => {
      const country = getFaculty(option, facultydata as FacultyType[]);

      return (
        <Chip
          {...getTagProps({ index })}
          key={country.label}
          label={country.label}
          size="small"
          variant="soft"
          icon={
            <FlagIcon
              key={country.label}
              code={country.code}
              sx={{ width: 16, height: 16, borderRadius: '50%' }}
            />
          }
        />
      );
    });

  const getOptionLabel = (option: FacultyType) =>
    getValue === 'label'
      ? option?.label
      : displayValueByFacultyCode(option, facultydata as FacultyType[]);

  return (
    <Autocomplete
      id={`country-select-${id}`}
      multiple={multiple}
      options={options}
      autoHighlight={!multiple}
      disableCloseOnSelect={multiple}
      renderOption={renderOption}
      renderInput={renderInput}
      renderTags={multiple ? renderTags : undefined}
      // @ts-ignore
      getOptionLabel={getOptionLabel}
      {...other}
    />
  );
}
