import { Dashboard01 } from '../components/Dashboard01'
import { Dashboard02 } from '../components/Dashboard02'
import { Dashboard03 } from '../components/Dashboard03'
import { Dashboard05 } from '../components/Dashboard05';
import classes from '../styles/dashboard.module.css'
import { Grid } from '@mantine/core';


const dashboard = () => {
  return (
    <div className={classes.mainContent}>
      <h1>Dashboard</h1>
      <div className={classes.dashboardContainer}>
        <Dashboard01/>
        <div className={classes.dashboardContainer}>
        <Grid>
          <Grid.Col span={6}>
            <Dashboard02 />
          </Grid.Col>
          <Grid.Col span={6}>
            <Dashboard03 />
          </Grid.Col>
        </Grid>
        <div className={classes.dashboardContainer}>
        <Dashboard05 />
        </div>
        </div>
      </div> 
    </div>
  ); 

    
}

export default dashboard