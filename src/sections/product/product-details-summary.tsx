import type { ICheckoutItem } from 'src/types/checkout';
import type { DebateInfo } from 'src/pages/dashboard/product/details';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  product: DebateInfo;
  items?: ICheckoutItem[];
  disableActions?: boolean;
  onGotoStep?: (step: number) => void;
  onAddCart?: (cartItem: ICheckoutItem) => void;
};

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}: Props) {
  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {product?.description}
    </Typography>
  );

  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h5">{product?.title}</Typography>

        {renderSubDescription}
      </Stack>
    </Stack>
  );
}
