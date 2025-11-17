import { AreaChart } from '@mantine/charts';
import { data } from '../mock/data05';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';


export function Dashboard05() {
  return (
    <><h4>Ocorrencia por Natureza Mensal</h4>
    <AreaChart
      h={300}
      data={data}
      dataKey="date"
      series={[
        { name: 'Apples', color: 'indigo.6' },
        { name: 'Oranges', color: 'blue.6' },
        { name: 'Tomatoes', color: 'teal.6' },
        { name: 'Tomatoes', color: 'teal.6' },
        { name: 'Tomatoes', color: 'teal.6' },
        { name: 'Tomatoes', color: 'teal.6' },
      ]}
      curveType="linear"
    />
    </>
  );
}