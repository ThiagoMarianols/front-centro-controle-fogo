import { BarChart } from '@mantine/charts';
import { data } from '../mock/data02';

export function Dashboard02() {
  return (
    <div>
    <BarChart
      h={300}
      data={data}
      dataKey="month"
      withLegend
      legendProps={{ verticalAlign: 'bottom', height: 50, align: 'center', layout: 'horizontal'}}
      series={[
        { name: 'Incendio', color: 'yellow.4' },
        { name: 'Afogamento', color: 'blue.6' },
        { name: 'Desastres', color: 'gray.4' },
      ]}
    />
    </div>
  );
}
