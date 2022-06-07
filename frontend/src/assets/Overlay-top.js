import { Box } from '@mui/system';

/**
 * Overlay-top Component
 * Used in Initial-startup Page
 * @returns Top Overlay Component 
 */

const Overlaytop = () => {
    return   <Box
    component="img"
    sx={{
      height: 4/11,
      width: 1/5,
    }}
    position="absolute"
    top = "0px"
    right = "0px"

    src="/Corner1.png"
  />

}

export default Overlaytop