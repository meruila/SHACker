import React from "react";
import { Container, Divider, Grid, Typography } from "@mui/material";

// Developers' DP
import imgDPDefault from '../assets/images/default-pic.jpg'
// Backend
import imgBeHizon from '../assets/images/backend/HIZON_backend.PNG';
import imgBeJusto from '../assets/images/backend/JUSTO_backend.png';
import imgBeLee from '../assets/images/backend/LEE_backend.jpg';
// Database
import imgDbArguelles from '../assets/images/database/ARGUELLES_database.JPG';
import imgDbFuentes from '../assets/images/database/FUENTES_database.jpg';
import imgDbPaelden from '../assets/images/database/PAELDEN_database.png';
import imgDbCeradoy from '../assets/images/database/CERADOY_database.jpg';
import imgDbDuhaylungsod from '../assets/images/database/DUHAYLUNGSOD_database.jpg';
// Frontend
import imgFePascua from '../assets/images/frontend/cjmpascua.png';
import imgFeAustria from '../assets/images/frontend/jbaustria.jpg';
import imgFeAvila from '../assets/images/frontend/jmcavila.jpg';
import imgFeAlmendrala from '../assets/images/frontend/kgcalmendrala.jpg';

import ShackerToolbar from '../components/ShackerToolbar'

// Styles
const teamMemberImgStyle = {
  width: 150,
  height: 150,
  backgroundColor: '#eee',
  borderRadius: 150,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)',
};
const teamLeaderImgStyle = {
  width: 200,
  height: 200,
  backgroundColor: '#eee',
  borderRadius: 200,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)',
};

/**
 * Component for About Page.
 * Required fields include the first name, last name, email to be able to add a new user successfully.
 * @returns React component for About Page.
 */

function AboutPage() {
    return (
        <div style={{ backgroundColor: '#F9FBFA' }}>
        <ShackerToolbar />
        <Grid container spacing={4} sx={{ px: 4 }}>
            {/* Project Title */}
            <Grid item xs={5}>
                <Typography textAlign="right" variant="h1" component="div" gutterBottom sx={{
                    pt: 5,
                    pl: 20,
                    fontWeight: 'bold',
                    fontSize: 72,
                    mb: 6,
                    mt: 3
                }}>
                    <span style={{ 
                    color: "#8A1538",
                    fontFamily: "Raleway"
                    }}>about</span> <span style={{ 
                    color: "#0D542F",
                    fontFamily: "Raleway" 
                    }}>SHACker</span>
                </Typography>
            </Grid>

            {/* Project Description */}
            <Grid item xs={7}>
                <Typography textAlign="justify" variant="body1" component="div" gutterBottom sx={{
                    pt: 5,
                    pr: 20,
                    mb: 6,
                    mt: 3,
                    fontSize: 20,
                }}>
                    {/* "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. magaling kami fr Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu" */}
                    {/* magaling tayo fr */}
                </Typography>
            </Grid>
        </Grid>
        
        <Container>
            <Grid container spacing={4} sx={{ 
            pl: 20,
            pr: 12,
            display: "flex",
            alignItems: "center"
            }}>
            <Grid item xs={3}>
                <img src={imgBeHizon} style={{
                borderRadius: "100%",
                height: 200,
                width: 200,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)',
                }} alt="Red Hizon" />
            </Grid>
            <Grid item xs={4}>
                <Typography variant="h2" component="div" gutterBottom sx={{
                fontSize: 42,
                pl: 4,
                mb: 1
                }}>
                Red Hizon
                </Typography>
                <Typography variant="h3" component="div" gutterBottom sx={{
                fontSize: 20,
                pl: 4,
                fontWeight: "bold"
                }}>
                project manager
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <Typography variant="h1" component="div" gutterBottom sx={{
                fontWeight: 'bold',
                fontSize: 72
                }}>
                <span style={{
                    color: "#8A1538",
                    fontFamily: "Raleway"
                }}>meet</span> <br/> <span style={{
                    color: "#0D542F",
                    fontFamily: "Raleway"
                }}>the team</span>
                </Typography>
            </Grid>
            </Grid>
        </Container>

        
        <Container sx={{ mt: 6 }}>
        {/* BACK-END DEVELOPERS */}
            <Divider />
            <Typography variant="h3" fontSize={20} fontWeight="bold" sx={{ my: 4, px: 6 }}>
            back-end developers
            </Typography>
            <Grid container sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <img alt="Jenel Justo (Team Leader)" style={teamLeaderImgStyle} src={imgBeJusto} />
                    <Typography variant="subtitle1" fontSize={25}>Jenel Justo</Typography>
                </Grid>
                <Grid item xs={4} sx={{textAlign: 'center' }}>
                    <img alt="Serena Mae Lee (Team Member)" style={teamMemberImgStyle} src={imgBeLee} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Serena Mae Lee</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <img alt="Rafael Red Angelo Hizon (Project Manager and Team Member)" style={teamMemberImgStyle} src={imgBeHizon} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Rafael Red Angelo Hizon</Typography>
                </Grid>
            </Grid>

        {/* DATABASE DEVELOPERS */}
            <Divider />
            <Typography variant="h3" fontSize={20} fontWeight="bold" sx={{ my: 4, px: 6 }}>
            database developers
            </Typography>
            <Grid container sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <img alt="Mira Arguelles (Team Leader)" style={teamLeaderImgStyle} src={imgDbArguelles} />
                    <Typography variant="subtitle1" fontSize={25}>Mira Arguelles</Typography>
                </Grid>
                <Grid item xs={2} sx={{textAlign: 'center' }}>
                    <img alt="Joan Paelden (Team Member)" style={teamMemberImgStyle} src={imgDbPaelden} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Joan Paelden</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <img alt="Jeano Duhaylungsod (Team Member)" style={teamMemberImgStyle} src={imgDbDuhaylungsod} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Jeano Duhaylungsod</Typography>
                </Grid>
                <Grid item xs={2} sx={{textAlign: 'center' }}>
                    <img alt="Cid Ceradoy (Team Member)" style={teamMemberImgStyle} src={imgDbCeradoy} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Cid Ceradoy</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <img alt="Paul Fuentes (Team Member)" style={teamMemberImgStyle} src={imgDbFuentes} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Paul Fuentes</Typography>
                </Grid>
            </Grid>

        {/* FRONT-END DEVELOPERS */}
            <Divider />
            <Typography variant="h3" fontSize={20} fontWeight="bold" sx={{ my: 4, px: 6 }}>
            front-end developers
            </Typography>
            <Grid container sx={{ display: 'flex', alignItems: 'center', pb: 6 }}>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <img alt="Gem Almendrala (Team Leader)" style={teamLeaderImgStyle} src={imgFeAlmendrala} />
                    <Typography variant="subtitle1" fontSize={25}>Gem Almendrala</Typography>
                </Grid>
                <Grid item xs={2.66} sx={{textAlign: 'center' }}>
                    <img alt="John Heinrich Austria (Team Member)" style={teamMemberImgStyle} src={imgFeAustria} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>John Heinrich Austria</Typography>
                </Grid>
                <Grid item xs={2.66} sx={{ textAlign: 'center' }}>
                    <img alt="Jaeser Avila (Project Manager and Team Member)" style={teamMemberImgStyle} src={imgFeAvila} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Jaeser Avila</Typography>
                </Grid>
                <Grid item xs={2.66} sx={{textAlign: 'center' }}>
                    <img alt="Christian Pascua (Team Member)" style={teamMemberImgStyle} src={imgFePascua} />
                    <Typography variant="subtitle1" fontSize={15} sx={{ mt: 1 }}>Christian Pascua</Typography>
                </Grid>
            </Grid>
        </Container>

        {/* Footer logo and page title */}
        {/* <Box sx={{
            px: 18,
            pt: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
        }}>
            <img src={mainLogo} alt="UPLB Logo" height="45" />
            <Typography variant="h6" sx={{ 
            color: '#9B1515',
            fontWeight: 'bold',
            fontSize: 15
            }}>Administrator Sign-Up Page</Typography>
        </Box> */}
        </div>
    );
}

export default AboutPage;
