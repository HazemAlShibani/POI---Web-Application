import type { StackProps } from '@mui/material/Stack';

import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const FAQs = [
  {
    question: 'How can I get the latest features and updates for POI?',
    answer: (
      <Typography>
        You will receive regular updates and improvements to POI for free during your first 12
        months. After that, you can renew your plan to continue getting the latest enhancements.
        Learn more about updates and feature releases on our
        <Link
          href="https://support.poi.com/updates"
          target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          support page
        </Link>
        .
      </Typography>
    ),
  },
  {
    question: 'Which POI subscription plan is right for me?',
    answer: (
      <Box component="ul" sx={{ pl: 3, listStyleType: 'disc' }}>
        <li> All plans include core debate customization features.</li>
        <li> Basic plan is ideal for casual discussions and small teams.</li>
        <li>
          {' '}
          <strong>Pro</strong> plan supports professional debates and structured discussions with
          advanced video call tools.
        </li>
        <li>
          {' '}
          <strong>Enterprise</strong> plan is perfect for organizations managing large-scale debate
          sessions.
        </li>
        <li>
          Learn more about the
          <Link href="https://poi.com/pricing" target="_blank" rel="noopener" sx={{ mx: 0.5 }}>
            pricing & plans
          </Link>
          .
        </li>
      </Box>
    ),
  },
  {
    question: 'How long does my subscription last?',
    answer: (
      <Box component="ul" sx={{ pl: 3, listStyleType: 'disc' }}>
        <li> Your subscription lasts for 12 months.</li>
        <li> You can renew anytime to keep accessing premium features.</li>
      </Box>
    ),
  },
  {
    question: 'Which devices and browsers support POI?',
    answer: (
      <Typography>
        POI works seamlessly on the latest versions of Chrome, Firefox, Safari, and Edge. Mobile
        support is available for iOS and Android. Learn more about
        <Link
          href="https://poi.com/platform-support"
          target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          supported devices
        </Link>
        .
      </Typography>
    ),
  },
  {
    question: 'What kind of debates is POI suitable for?',
    answer: (
      <Typography>
        POI is designed for structured debates across various domains, including academic
        discussions, professional meetings, political debates, and informal brainstorming sessions.
      </Typography>
    ),
  },
  {
    question: 'Can I try POI for free before subscribing?',
    answer: (
      <Typography>
        Yes! You can explore our
        <Link href="https://poi.com/demo" target="_blank" rel="noopener" sx={{ mx: 0.5 }}>
          free demo version
        </Link>
        , which provides an overview of the key features, debate formats, and video call
        capabilities.
      </Typography>
    ),
  },
];

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }: StackProps) {
  const [expanded, setExpanded] = useState<string | false>(FAQs[0].question);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = (
    <SectionTitle
      caption="FAQs"
      title="We’ve got the"
      txtGradient="answers"
      sx={{ textAlign: 'center' }}
    />
  );

  const renderContent = (
    <Stack
      spacing={1}
      sx={{
        mt: 8,
        mx: 'auto',
        maxWidth: 720,
        mb: { xs: 5, md: 8 },
      }}
    >
      {FAQs.map((item, index) => (
        <Accordion
          key={item.question}
          component={m.div}
          variants={varFade({ distance: 24 }).inUp}
          expanded={expanded === item.question}
          onChange={handleChange(item.question)}
          sx={{
            borderRadius: 2,
            transition: (theme) =>
              theme.transitions.create(['background-color'], {
                duration: theme.transitions.duration.short,
              }),
            '&::before': { display: 'none' },
            '&:hover': {
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
            },
            '&:first-of-type, &:last-of-type': { borderRadius: 2 },
            [`&.${accordionClasses.expanded}`]: {
              m: 0,
              borderRadius: 2,
              boxShadow: 'none',
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            },
            [`& .${accordionSummaryClasses.root}`]: {
              py: 3,
              px: 2.5,
              minHeight: 'auto',
              [`& .${accordionSummaryClasses.content}`]: {
                m: 0,
                [`&.${accordionSummaryClasses.expanded}`]: { m: 0 },
              },
            },
            [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
          }}
        >
          <AccordionSummary
            expandIcon={
              <Iconify
                width={20}
                icon={expanded === item.question ? 'mingcute:minimize-line' : 'mingcute:add-line'}
              />
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Typography variant="h6"> {item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );

  const renderContact = (
    <Stack
      alignItems="center"
      sx={{
        px: 3,
        py: 8,
        textAlign: 'center',
        background: (theme) =>
          `linear-gradient(270deg, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}, ${varAlpha(theme.vars.palette.grey['500Channel'], 0)})`,
      }}
    >
      <m.div variants={varFade().in}>
        <Typography variant="h4">Still have questions?</Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
          Please describe your case to receive the most accurate advice
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Button
          color="inherit"
          variant="contained"
          href="mailto:hazem.alshibani03@gmail.com?subject=Feedback from Customer"
          startIcon={<Iconify icon="fluent:mail-24-filled" />}
        >
          Contact us
        </Button>
      </m.div>
    </Stack>
  );

  return (
    <Stack component="section" sx={{ ...sx }} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        <TopLines />

        <Container>
          {renderDescription}
          {renderContent}
        </Container>

        <Stack sx={{ position: 'relative' }}>
          <BottomLines />
          {renderContact}
        </Stack>
      </MotionViewport>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function TopLines() {
  return (
    <>
      <Stack
        spacing={8}
        alignItems="center"
        sx={{
          top: 64,
          left: 80,
          position: 'absolute',
          transform: 'translateX(-15px)',
        }}
      >
        <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
        <FloatTriangleDownIcon
          sx={{
            position: 'static',
            opacity: 0.24,
            width: 30,
            height: 15,
          }}
        />
      </Stack>
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );
}

function BottomLines() {
  return (
    <>
      <FloatLine sx={{ top: 0, left: 0 }} />
      <FloatLine sx={{ bottom: 0, left: 0 }} />
      <FloatPlusIcon sx={{ top: -8, left: 72 }} />
      <FloatPlusIcon sx={{ bottom: -8, left: 72 }} />
    </>
  );
}
