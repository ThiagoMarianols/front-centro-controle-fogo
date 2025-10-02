import classes from '../styles/Home.module.css';
import { StatsGrid } from '../components/StatsGrid';
import { ToolBar } from '../components/ToolBar';

const Home = () => {
  return (
    <div className={classes.mainContent}>
      
      <div className={classes.statsGrid}>
        <StatsGrid />
      </div>
      <div className={classes.toolbar}>
        <ToolBar />
      </div>
    </div>
  )
}

export default Home