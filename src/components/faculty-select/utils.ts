// ----------------------------------------------------------------------

import type { FacultyType } from './faculty-select';

export function getFaculty(inputValue: FacultyType, data: FacultyType[]) {
  const option = data?.filter(
    (country) => country?.label === inputValue?.label || country?.code === inputValue?.label
  )[0];

  return { code: option?.code, label: option?.label };
}

// ----------------------------------------------------------------------

export function displayValueByFacultyCode(inputValue: FacultyType, data: FacultyType[]) {
  const option = data?.filter((country) => country?.code === inputValue?.code)[0];

  return option?.label || '';
}
