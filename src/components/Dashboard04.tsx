import { PieChart } from '@mantine/charts';
import { data } from '../mock/data04';

export function Dashboard04() {
  return <PieChart data={data} withTooltip />;
}