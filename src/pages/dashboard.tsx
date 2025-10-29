import classes from '../styles/dashboard.module.css'
import { StatsGrid2 } from '../components/Statsgrid2'


const dashboard = () => {
  return (
    <>
    <div className={classes.mainContent}>
        <h1>Dashboard</h1>
      <StatsGrid2 />
    </div>
    </>

  )
}

export default dashboard