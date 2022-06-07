import { Container, Typography, Button, Grid } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import buddyImage from '../assets/images/buddy.png';

/**
 * Component for 404 Error Page
 * Outputs error and can return user back to previous accessible page
 */

function ErrorPage() {
    const Navigate = useNavigate();

    return(
        <div>
            <Container sx={{paddingTop:'5%'}}>
                <Grid container
                    alignItems='center'
                    justifyContent="center"
                    spacing={0}
                >
                    <Grid item>
                        <img width={250} height={250} src={buddyImage} />
                    </Grid>
                    <Grid item>
                        <Typography variant='h1'>
                            404 - Page not found
                        </Typography>
                    </Grid>
                    <Grid item >
                        <Typography>
                            Oops! The page you are looking for might have been renamed or temporarily available
                        </Typography>
                    </Grid>

                    {/* Returns the user to previously accessed page */}
                    <Grid item>
                        <Button onClick={() => Navigate(-1)}>{' Go back.'}</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default ErrorPage;