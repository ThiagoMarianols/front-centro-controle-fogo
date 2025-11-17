import { Select,  type SelectProps  } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

const data = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);


  type DashboardFilterSelectProps = SelectProps & {
};

export function DashboardFilterSelect(props: DashboardFilterSelectProps) {
  return (
    <>
    <Select
        data={data}
        withScrollArea={false}
        styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
        mt="md"
        {...props}
      />
    </>
  );
}