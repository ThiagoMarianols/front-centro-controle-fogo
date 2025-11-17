import { BarChart } from '@mantine/charts';
import { data } from '../mock/data03';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

type Dashboard03Props = {
  statusFilter: string | null;
};

export function Dashboard03({ statusFilter }: Dashboard03Props) {
  return (
    <div>
      <h4>Total Geral de Ocorrencias mensal</h4>
    <BarChart
      h={300}
      data={data}
      dataKey="month"
      cursorFill="#e0e0e081"
      withTooltip={false}
      orientation="vertical"
      yAxisProps={{ width: 80 }}
      barProps={{ radius: 10 }}
      series={[{ name: 'Ocorrencias', color: 'red' }]}

    />
    </div>
  );
}