import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ width = 45, height = 40, disableLink = false, className, href = '/', sx, ...other }, ref) => {
    const logo = (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="poi-1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor="var(--palette-primary-dark)" />
            <stop offset="100%" stopColor="var(--palette-primary-main)" />
          </linearGradient>
          <linearGradient id="poi-2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="var(--palette-primary-light)" />
            <stop offset="100%" stopColor="var(--palette-primary-main)" />
          </linearGradient>
        </defs>
        <text
          x="50"
          y="360"
          fontSize="300"
          fontFamily="Segoe UI, sans-serif"
          fontWeight="bold"
          fill="url(#poi-2)"
        >
          POI
        </text>
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{ flexShrink: 0, display: 'inline-flex', verticalAlign: 'middle', ...sx }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
