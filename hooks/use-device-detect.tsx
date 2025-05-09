import { useMediaQuery } from 'usehooks-ts'

export const useDeviceDetect = () => {
  // Check if device is mobile (phone)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Check if device is tablet in portrait orientation
  const isTabletPortrait = useMediaQuery(
    '(min-width: 769px) and (max-width: 1024px)'
  )

  // Check if device is tablet in landscape orientation (larger width but still touch-based)
  const isTabletLandscape = useMediaQuery(
    '(min-width: 1025px) and (max-width: 1366px) and (hover: none)'
  )

  // Check if device has touch capability
  const hasTouchScreen = useMediaQuery('(hover: none) and (pointer: coarse)')

  // Combine tablet detection for both orientations
  const isTablet = isTabletPortrait || isTabletLandscape

  // A device is a touch device if it's either mobile, tablet, or has a touch screen
  const isTouchDevice = isMobile || isTablet || hasTouchScreen

  return {
    isMobile,
    isTablet,
    isTabletPortrait,
    isTabletLandscape,
    hasTouchScreen,
    isTouchDevice
  }
}
