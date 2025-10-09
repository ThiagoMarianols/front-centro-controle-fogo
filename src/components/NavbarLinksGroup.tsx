import { useState } from 'react';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from '../styles/NavbarLinksGroup.module.css';
import { Link } from 'react-router-dom';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string; // rota direta quando não há sublinks
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, link }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const isDirectLink = !hasLinks && !!link;
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={Link}
      to={link.link}
      className={classes.link}
      key={link.label}
    >
      {link.label}
    </Text>
  ));

  const controlContent = (
    <Group justify="space-between" gap={0}>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <ThemeIcon variant="light" size={30}>
          <Icon size={18} />
        </ThemeIcon>
        <Box ml="md">{label}</Box>
      </Box>
      {hasLinks && (
        <IconChevronRight
          className={classes.chevron}
          stroke={1.5}
          size={16}
          style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
        />
      )}
    </Group>
  );

  return (
    <>
      {isDirectLink ? (
        <UnstyledButton component={Link} to={link!} className={classes.control}>
          {controlContent}
        </UnstyledButton>
      ) : (
        <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
          {controlContent}
        </UnstyledButton>
      )}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = {
  label: 'Releases',
  icon: IconCalendarStats,
  links: [
    { label: 'Upcoming releases', link: '/' },
    { label: 'Previous releases', link: '/' },
    { label: 'Releases schedule', link: '/' },
  ],
};

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  );
}