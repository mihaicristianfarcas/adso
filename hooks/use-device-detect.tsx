import { useMediaQuery } from 'usehooks-ts'

export const useDeviceDetect = () => {
  // Check if device is mobile (phone)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Check if device is tablet in portrait orientation
  const isTabletPortrait = useMediaQuery(
    '(min-width: 769px) and (max-width: 1024px)'
  )

  // Check if device is tablet in landscape orientation (based only on screen size)
  const isTabletLandscape = useMediaQuery(
    '(min-width: 1025px) and (max-width: 1366px)'
  )

  // Check if device has touch capability (regardless of screen size)
  // This uses 'hover: none' which means the device doesn't support hover
  // and 'pointer: coarse' which indicates touch input
  const hasTouchScreen = useMediaQuery('(hover: none) and (pointer: coarse)')

  // Combine tablet detection for both orientations
  const isTablet = isTabletPortrait || isTabletLandscape

  // A device is a touch device if it has a touch screen (not based on screen size)
  // This is the property that should be used for showing/hiding hover elements
  const isTouchDevice = hasTouchScreen

  return {
    isMobile,
    isTablet,
    isTabletPortrait,
    isTabletLandscape,
    hasTouchScreen,
    isTouchDevice
  }
}
