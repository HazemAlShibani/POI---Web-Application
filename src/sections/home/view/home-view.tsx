import Stack from '@mui/material/Stack';

import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from '../home-hero';
import { HomeFAQs } from '../home-faqs';
import { HomeMinimal } from '../home-debate';
import { HomeTestimonials } from '../home-testimonials';
import { HomeHugePackElements } from '../home-hugepack-elements';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />

      <HomeHero />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        <HomeMinimal />

        <HomeHugePackElements />

        <HomeTestimonials />

        <HomeFAQs />
      </Stack>
    </>
  );
}
