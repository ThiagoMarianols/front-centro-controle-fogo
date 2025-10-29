import { BarChart } from '@mantine/charts';
import { data } from '../mock/data03';

export function Dashboard03() {
  return (
    <BarChart
      h={300}
      data={data}
      dataKey="month"
      orientation="vertical"
      yAxisProps={{ width: 80 }}
      barProps={{ radius: 10 }}
      series={[{ name: 'Ocorrencias', color: 'red' }]}
    />
  );
}