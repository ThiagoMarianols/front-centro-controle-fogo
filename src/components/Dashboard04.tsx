import { PieChart } from '@mantine/charts';
import { data } from '../mock/data04';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

export function Dashboard04() {
  return <PieChart data={data} withTooltip />;
}