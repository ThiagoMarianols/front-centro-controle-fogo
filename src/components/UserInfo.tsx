import { IconAt, IconPhoneCall } from '@tabler/icons-react';
import { Avatar, Group, Text } from '@mantine/core';
import classes from '../styles/UserInfo.module.css';

export function UserInfo() {
  return (
    <div>
      <Group wrap="nowrap">
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
          size={50}
          radius="md"
        />
        <div className={classes.userInfo}>
          <Text fz="lg" fw={500} className={classes.name}>
            Fernando Azevedo
          </Text>

          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            2º Tenente
          </Text>
        </div>
      </Group>
    </div>
  );
}