import { BarChart } from '@mantine/charts';
import { Paper, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import { data } from '../mock/data02';
import classes from '../styles/dashboard02.module.css';

interface ChartTooltipProps {
  label: React.ReactNode;
  payload: Record<string, any>[] | undefined;
}

type Dashboard02Props = {
  statusFilter: string | null;
};

function ChartTooltip({ label, payload }: ChartTooltipProps) {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>
        {label}
      </Text>
      {payload.map((item: any) => (
        <Text key={item.name} c={item.color} fz="sm">
          {item.name}: {item.value}
        </Text>
      ))}
    </Paper>
  );
}




export function Dashboard02({ statusFilter }: Dashboard02Props) {
  return (
    <div>
      <h4>3 Maiores Batalhões Mensal</h4>
      <div className={classes.chartContainer}>
        <BarChart
          h={300}
          data={data}
          dataKey="month"
          tooltipProps={{
            content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
          }}
          cursorFill="#b9b9b9ff"
          series={[
            { name: 'Incendio', color: 'yellow.4' },
            { name: 'Afogamento', color: 'blue.6' },
            { name: 'Desastres', color: 'gray.4' },
          ]}
          
        />
      </div>
    </div>
  );
}
