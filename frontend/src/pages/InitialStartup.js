import { Box, Link, Stack } from '@mui/material';

import Overlaybottom from '../assets/Overlay-bottom';
import Overlaytop from '../assets/Overlay-top';


/**
 * Component for Initial Start-up Page
 * The page is accessed when the app is first used
 * Links the user to the create admin page and login page
 */

const green = "#0D542F";

const InitialStartup = () => {

    return <div>
        <Overlaytop />
            <Stack spacing={3}
                component="div"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '19%'
                }}
            >   
                {/* Renders the SHACker Logo with Label */}
                <Box
                    component="img"
                    width="33%"
                    align="center"
                    src="/SHACKER-icon-with-label.png"
                />

                {/* Links to the Create admin user account*/}
                <Link href="create-admin" underline="hover" color="maroon">
                    {'Don\'t have an account yet? Sign up here.'}
                </Link>

                {/* Links to the Login Page
                 * Used when admin account has been created
                 */}
                <Link href="login" underline="hover" color={green}>
                    {'\ Else, log in.'}
                </Link>
            </Stack>
        <Overlaybottom />
    </div>;
}

export default InitialStartup;