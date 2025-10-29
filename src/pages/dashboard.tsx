import classes from '../styles/dashboard.module.css'
import Logo from '../assets/img/LogoCCF1.png'

const Dashboard = () => {
  return (
    <div className={classes.mainContent} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      minHeight: '70vh'
    }}>
      <img src={Logo} alt="Centro de Controle de Fogo" style={{ width: 160, height: 'auto', opacity: 0.9 }} />
      <h1 style={{ margin: 0 }}>Em manutenção</h1>
      <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: 480 }}>
        Estamos trabalhando para melhorar esta área. Tente novamente mais tarde.
      </p>
    </div>
  )
}

export default Dashboard