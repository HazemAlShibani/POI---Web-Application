import type { IProductItem } from 'src/types/product';

import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'src/routes/hooks';

import { getoneDebate } from 'src/apis';
import { CONFIG } from 'src/config-global';

import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Debate details | Dashboard - ${CONFIG.site.name}` };

export type DebateInfo =
  | {
      id: number;
      title?: string | null;
      coverUrl: string;
      description: string;

      applicants_count: number;
      chair_judge?: string | null;
      filter?: string | null;
      is_able_to_apply: boolean;
      start_date: string;
      start_time: string;
      status: 'announced' | 'pending' | 'completed' | string;
      type: 'online' | 'offline' | string;
    }
  | undefined;

export default function Page() {
  const { id = '' } = useParams();

  const {
    data: oneOfDebate,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['get-one-debate', id],
    queryFn: () => getoneDebate(Number(id)),
    enabled: () => !!id,
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

  const dummyProductItem: IProductItem = {
    id: 'prod_001',
    sku: 'SHOE-2025-001',
    name: 'Velocity Runner X',
    code: 'VRX-001',
    price: 149.99,
    taxes: 12.5,
    tags: ['running', 'lightweight', 'new'],
    sizes: ['40', '41', '42', '43', '44'],
    publish: 'published',
    gender: ['men', 'unisex'],
    coverUrl: 'https://dummyimage.com/600x400/000/fff&text=Velocity+Runner+X',
    images: [
      'https://dummyimage.com/600x400/111/fff&text=Side+View',
      'https://dummyimage.com/600x400/222/fff&text=Top+View',
      'https://dummyimage.com/600x400/333/fff&text=In+Action',
    ],
    colors: ['black', 'red', 'gray'],
    quantity: 200,
    category: 'Footwear',
    available: 180,
    totalSold: 20,
    description:
      'Engineered for speed and comfort, the Velocity Runner X features breathable mesh, responsive cushioning, and a sleek silhouette.',
    totalRatings: 4.6,
    totalReviews: 3,
    createdAt: '',
    inventoryType: 'in_stock',
    subDescription: 'Ideal for daily training and competitive races.',
    priceSale: 119.99,
    reviews: [
      {
        id: 'rev_001',
        name: 'Hazem Al-Khatib',
        rating: 5,
        comment: 'Super light and responsive. Perfect for my morning runs!',
        helpful: 14,
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        postedAt: '',
        isPurchased: true,
        attachments: ['https://dummyimage.com/300x300/aaa/fff&text=On+Feet'],
      },
      {
        id: 'rev_002',
        name: 'Lina Darwish',
        rating: 4,
        comment: 'Stylish and comfortable, but the arch support could be better.',
        helpful: 6,
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        postedAt: '',
        isPurchased: true,
      },
      {
        id: 'rev_003',
        name: 'Omar Suleiman',
        rating: 4.5,
        comment: 'Great value for the price. I use them for both gym and street.',
        helpful: 9,
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        postedAt: '',
        isPurchased: false,
      },
    ],
    ratings: [
      { name: '5 stars', starCount: 5, reviewCount: 1 },
      { name: '4 stars', starCount: 4, reviewCount: 2 },
    ],
    saleLabel: {
      enabled: true,
      content: '20% OFF',
    },
    newLabel: {
      enabled: true,
      content: 'Just Launched',
    },
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductDetailsView product={oneOfDebate} loading={isPending} error={isError} />
    </>
  );
}
