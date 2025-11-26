import { useEffect, useState } from 'react';
import { Avatar, Group, Text } from '@mantine/core';
import classes from '../styles/UserInfo.module.css';
import { getUserInfo } from '../services/authService';
import type { UserInfoDTO } from '../interface/User';
import userAvatar from '../assets/img/img_IA/Bombeiro.jpg';

export function UserInfo() {
  const [infoUser, setInfoUser] = useState<UserInfoDTO>();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data: UserInfoDTO = await getUserInfo();
        setInfoUser(data);
      } catch (err) {
        console.error('Erro ao buscar informações do usuário:', err);
      }
    }
    if (!infoUser) {
      fetchUser();
    }
  }, []);

  return (
    <div>
      <Group wrap="nowrap">
        <Avatar src={userAvatar} size={50} radius="md" />
        <div className={classes.userInfo}>
          <Text fz="lg" fw={500} className={classes.name}>
            {infoUser?.normalizedName}
          </Text>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {infoUser?.patent?.name}
          </Text>
        </div>
      </Group>
    </div>
  );
}
