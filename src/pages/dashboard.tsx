import { Dashboard01 } from '../components/Dashboard01'
import { Dashboard02 } from '../components/Dashboard02'
import { Dashboard03 } from '../components/Dashboard03'
import { Dashboard05 } from '../components/Dashboard05';
import { DashboardFilterSelect } from '../components/DashboardFilterSelect';
import classes from '../styles/dashboard.module.css'
import {Grid } from '@mantine/core';
import { useState } from 'react';



const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  return (
    <div className={classes.mainContent}>
      <h1>Dashboard</h1>
      <div className={classes.chartsGrid}>
        <Dashboard01
        //ainda ajustando o desing ente as filters e o gráfico
        statusFilter={statusFilter}
        />

        <Grid >
          <Grid.Col span={3}>
            <DashboardFilterSelect 
            value={statusFilter}          // ADICIONADO
            onChange={setStatusFilter}
            label="Status da ocorrência"
            placeholder="Selecione o status"/>
          </Grid.Col>
          <Grid.Col span={3}>
            <DashboardFilterSelect
            value={statusFilter}          // ADICIONADO
            onChange={setStatusFilter}
            label="Natureza da ocorrência"
            placeholder="Selecione a natureza"/>
          </Grid.Col>
          <Grid.Col span={3}>
            <DashboardFilterSelect
            value={statusFilter}          // ADICIONADO
            onChange={setStatusFilter} 
            label="Batalhão"
            placeholder="Selecione o batalhão"/>
          </Grid.Col>
          <Grid.Col span={3}>
            <DashboardFilterSelect
            value={statusFilter}          // ADICIONADO
            onChange={setStatusFilter} 
            label="Cidade da ocorrência"
            placeholder="Selecione a cidade"/>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <Dashboard02 statusFilter={statusFilter}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <Dashboard03 statusFilter={statusFilter}/>
          </Grid.Col>
        </Grid>

        <Dashboard05 />
        </div>
      </div> 

  ); 

    
}

export default Dashboard