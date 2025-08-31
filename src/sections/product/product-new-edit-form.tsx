import type { IProductItem } from 'src/types/product';
import type { IDatePickerControl } from 'src/types/common';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import { MobileDateTimePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createDebateHandler } from 'src/apis';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  type: zod.string().min(1, { message: 'Debate Type is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export type CreateDebateData = {
  date?: string;
  time?: string;
  type: string;
};

export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const [valueResponsive, setValueResponsive] = useState<IDatePickerControl>(
    dayjs().startOf('day')
  );

  const defaultValues = useMemo(
    () => ({
      type: '',
    }),
    []
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { mutate: createDebate, isPending: isPendingCreateDebate } = useMutation({
    mutationKey: ['create-debate'],
    mutationFn: async (data: CreateDebateData) => createDebateHandler(data),
    onSuccess: () => {
      reset();
      toast.success('Create success!');
      router.push(paths.dashboard.product.root);
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const date = valueResponsive?.format('YYYY-MM-DD');
      const time = valueResponsive?.format('HH:mm');
      const { type } = data;

      createDebate({
        date,
        time,
        type,
      });
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Type, Date..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.DebateType fullWidth name="type" label="Debate Type" placeholder="Choose a Type" />

        <MobileDateTimePicker
          minDate={dayjs().startOf('day')}
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
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
        loading={isPendingCreateDebate}
      >
        Create Debate
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderActions}
      </Stack>
    </Form>
  );
}
