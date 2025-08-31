import type { IProductItem } from 'src/types/product';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Box, MenuItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllMotions, deleteOneMotions, createMotionHandler } from 'src/apis';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { MotionDetailsSkeleton } from './motion-skeleton';

// ----------------------------------------------------------------------

export const subjectData = [
  { value: '1', label: 'Economic' },
  { value: '2', label: 'Commercial' },
  { value: '3', label: 'Political' },
  { value: '4', label: 'Social' },
  { value: '5', label: 'Educational' },
  { value: '6', label: 'Environmental' },
  { value: '7', label: 'Technical' },
  { value: '8', label: 'Athlete' },
  { value: '9', label: 'Legal' },
  { value: '10', label: 'Cultural' },
  { value: '11', label: 'Technology' },
  { value: '12', label: 'philosophical' },
];

export const formData = [
  { value: '13', label: 'Policy' },
  { value: '14', label: 'Advocacy' },
  { value: '15', label: 'Regret' },
  { value: '16', label: 'Counter-Narrative' },
  { value: '17', label: 'Comparative' },
  { value: '18', label: 'Worldbuilding' },
  { value: '19', label: 'takeholder-Framed' },
  { value: '20', label: 'Scenario' },
];

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod
  .object({
    typeOfdebate: zod.string().min(1, { message: 'Debate Type is required!' }),
    sentence: zod.string().min(1, { message: 'Motion Sentence is required!' }),

    formValues: zod.string().optional(),
    subjectValues: zod.array(zod.string()).optional(),
  })
  .refine(
    (data) =>
      data.typeOfdebate.toLowerCase() !== 'form' ||
      (data.formValues && data.formValues.trim().length > 0),
    {
      message: 'Form value is required when debate type is "form".',
      path: ['formValues'],
    }
  )
  .refine(
    (data) =>
      data.typeOfdebate.toLowerCase() !== 'subject' ||
      (data.subjectValues && data.subjectValues.length >= 1),
    {
      message: 'At least 1 subjects are required when debate type is "subject".',
      path: ['subjectValues'],
    }
  );

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export type CreateMotionData = {
  sub_classifications: number[] | undefined;
  sentence: string;
};

export function ProductNewMotionForm({ currentProduct }: Props) {
  const defaultValues = useMemo(
    () => ({
      typeOfdebate: '',
      sentence: '',
      subjectValues: [],
    }),
    []
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, handleSubmit, watch } = methods;

  const { data: facultydata, isLoading } = useQuery({
    queryKey: ['get-all-motions'],
    queryFn: () => getAllMotions(),
    select: (data) => {
      const extended = data.map((ele) => ({
        id: ele.motion_id,
        sentence: ele.sentence,
      }));
      return extended;
    },
  });

  const { mutate: createMotion, isPending: isPendingCreateMotion } = useMutation({
    mutationKey: ['create-motion'],
    mutationFn: async (data: CreateMotionData) => createMotionHandler(data),
    onSuccess: () => {
      reset();
      toast.success('Create success!');
      window.location.reload();
    },
    onError: (errordata) => {
      toast.error(`Create failed! ${errordata}`);
    },
  });

  const { mutate: removeMotion, isPending: isPendingRemove } = useMutation({
    mutationKey: ['delete-motion'],
    mutationFn: async (id: Number) => deleteOneMotions(id),
    onSuccess: () => {
      reset();
      toast.success('Delete success!');
      window.location.reload();
    },
    onError: (errordata) => {
      toast.error(`Create failed! ${errordata}`);
    },
  });

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  if (isLoading) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <MotionDetailsSkeleton />
      </DashboardContent>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      const finalData = {
        sentence: data.sentence,
        sub_classifications:
          data.typeOfdebate === 'Subject'
            ? data.subjectValues?.map((ele) => Number(ele))
            : [Number(data.formValues)],
      };

      // console.log(finalData);
      createMotion(finalData);
    } catch (error) {
      console.error(error);
    }
  });

  const removeMotionHandler = (id: Number) => {
    removeMotion(id);
  };

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Type, Sentences..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.MotionType
          fullWidth
          name="typeOfdebate"
          label="Debate Type"
          placeholder="Choose a Type"
        />

        {watch('typeOfdebate') === 'Subject' && (
          <Field.MultiSelect
            chip
            checkbox
            name="subjectValues"
            label="Multi select"
            options={subjectData}
          />
        )}

        {watch('typeOfdebate') === 'Form' && (
          <Field.Select name="formValues" label="Form Types">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {formData.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
        )}

        <Field.Text multiline name="sentence" placeholder="Write a Sentence" />
      </Stack>
    </Card>
  );

  const renderAllMotions = (
    <Card>
      <CardHeader title="Motion Sentences" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3, maxHeight: '350px', overflowY: 'scroll' }}>
        {facultydata?.map((ele, id) => (
          <Box sx={{ display: 'flex', gap: '25px' }}>
            <Field.Text
              disabled
              multiline
              fullWidth
              value={ele.sentence}
              name={`sentence${id}`}
              placeholder="Write a Sentence"
            />
            <LoadingButton
              onClick={() => removeMotionHandler(ele.id)}
              sx={{ maxHeight: 'fit-content' }}
              size="medium"
              color="primary"
              variant="contained"
              loading={isPendingRemove}
            >
              Remove
            </LoadingButton>
          </Box>
        ))}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <LoadingButton
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        loading={isPendingCreateMotion}
      >
        Create Motion Sentence
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', mb: 4 }}>
        {renderAllMotions}
      </Stack>

      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderDetails}

        {renderActions}
      </Stack>
    </Form>
  );
}
