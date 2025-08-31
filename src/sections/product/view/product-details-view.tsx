import type { DebateInfo } from 'src/pages/dashboard/product/details';

import { z } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Divider, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { getAssignDebaters } from 'src/apis';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { EmptyContent } from 'src/components/empty-content';

import { ProductDetailsSkeleton } from '../product-skeleton';
import { ProductDetailsToolbar } from '../product-details-toolbar';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

type Props = {
  product?: DebateInfo;
  loading?: boolean;
  error?: any;
};

const OPTIONS = [
  { value: '1', label: 'Person One' },
  { value: '2', label: 'Person Two' },
  { value: '3', label: 'Person Three' },
  { value: '4', label: 'Person Four' },
  { value: '5', label: 'Person Five' },
  { value: '6', label: 'Person Six' },
  { value: '7', label: 'Person Seven' },
  { value: '8', label: 'Person Eight' },
];

const TeamMemberSchema = z
  .object({
    OG1: z.string().min(1, 'Required'),
    OG2: z.string().min(1, 'Required'),
    OO1: z.string().min(1, 'Required'),
    OO2: z.string().min(1, 'Required'),
    CG1: z.string().min(1, 'Required'),
    CG2: z.string().min(1, 'Required'),
    CO1: z.string().min(1, 'Required'),
    CO2: z.string().min(1, 'Required'),
  })
  .superRefine((data, ctx) => {
    const entries = Object.entries(data);

    const duplicates = entries
      .map(([key, value]) => ({ key, value }))
      .reduce(
        (acc, { key, value }) => {
          acc[value] = acc[value] ? [...acc[value], key] : [key];
          return acc;
        },
        {} as Record<string, string[]>
      );

    Object.entries(duplicates)
      .filter(([, keys]) => keys.length > 1)
      .flatMap(([, keys]) => keys)
      .forEach((key) => {
        ctx.addIssue({
          path: [key],
          code: z.ZodIssueCode.custom,
          message: 'Each person must be selected only once.',
        });
      });
  });

export function ProductDetailsView({ product, error, loading }: Props) {
  const tabs = useTabs('description');

  const methods = useForm({
    resolver: zodResolver(TeamMemberSchema),
    defaultValues: {
      OG1: '',
      OG2: '',
      OO1: '',
      OO2: '',
      CG1: '',
      CG2: '',
      CO1: '',
      CO2: '',
    },
  });

  const values = methods.watch();

  const summary = useMemo(() => {
    if (!product) return [];
    return [
      {
        title: 'Date',
        description: product.start_date,
        icon: 'solar:calendar-date-bold',
      },
      {
        title: 'Time',
        description: product.start_time,
        icon: 'solar:clock-circle-bold',
      },
      {
        title: 'Winner Team',
        description: 'The Butterflies',
        icon: 'solar:shield-check-bold',
      },
    ];
  }, [product]);

  const {
    data: oneOfDebate,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['get-assign-debaters', product?.id],
    queryFn: () => getAssignDebaters(Number(product?.id)),
    enabled: () => !!product?.id,
    select: (data) => ({
      id: data.debate_id,
      title: data.motion || 'Motion Sentence',
      coverUrl: 'https://dummyimage.com/600x400/000/fff&text=Velocity+Runner+X',
      description:
        'Engineered for speed and comfort, the Velocity Runner X features breathable mesh, responsive cushioning, and a sleek silhouette.',

      applicants_count: data.applicants_count,
      chair_judge: data.chair_judge,
      filter: data.filter,
      is_able_to_apply: data.is_able_to_apply,
      start_date: data.start_date.split('T')[0],
      start_time: data.start_time,
      status: data.status,
      type: data.type,
    }),
  });

  const onSubmit = async (data: z.infer<typeof TeamMemberSchema>) => {
    console.log('Submitted team members:', data);
  };

  if (loading) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <ProductDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Product not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${product?.id}`)}
        liveLink={paths.product.details(`${product?.id}`)}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <Image src={product?.coverUrl} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && <ProductDetailsSummary disableActions product={product} />}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 10 }}
      >
        {summary.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card sx={{ my: 5 }}>
        <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, p: 3, pb: 0 }}>
              Team Members
            </Typography>

            <Grid container sx={{ p: 3 }} spacing={2}>
              {['OG', 'OO', 'CG', 'CO'].map((team) => (
                <Grid xs={12} md={6} lg={3} key={team}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {team} team
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[1, 2].map((num) => {
                      const key = `${team}${num}` as keyof typeof values;
                      return (
                        <Field.Select key={key} name={key} label={`Member ${num}`}>
                          <MenuItem value="">None</MenuItem>
                          <Divider sx={{ borderStyle: 'dashed' }} />
                          {OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.label}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field.Select>
                      );
                    })}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'end',
              mb: 3,
              px: 3,
            }}
            spacing={3}
            direction="row"
            alignItems="center"
            flexWrap="wrap"
          >
            <LoadingButton type="submit" variant="contained" size="large">
              Assign Debaters
            </LoadingButton>
          </Stack>
        </Form>
      </Card>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[{ value: 'description', label: 'Description' }].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description ?? ''} />
        )}
      </Card>
    </DashboardContent>
  );
}
