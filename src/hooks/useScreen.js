import { useMediaQuery } from 'react-responsive';
import {
  isDesktopMin,
  isTabletMin,
  isTabletMax,
  isSmallTabletMin,
  isSmallTabletMax,
  isMobileMin,
  isMobileMax,
  isMobileLayoutMax,
  isCompactSearchMax,
} from '../utils/constants.js';

export function useScreen() {
  const isDesktop = useMediaQuery({ minWidth: isDesktopMin });
  const isTablet = useMediaQuery({
    minWidth: isTabletMin,
    maxWidth: isTabletMax,
  });
  const isSmallTablet = useMediaQuery({
    minWidth: isSmallTabletMin,
    maxWidth: isSmallTabletMax,
  });
  const isMobile = useMediaQuery({
    minWidth: isMobileMin,
    maxWidth: isMobileMax,
  });
  const isMobileLayout = useMediaQuery({ maxWidth: isMobileLayoutMax });
  const isCompactSearch = useMediaQuery({ maxWidth: isCompactSearchMax });

  return {
    isDesktop,
    isTablet,
    isSmallTablet,
    isMobile,
    isMobileLayout,
    isCompactSearch,
  };
}
