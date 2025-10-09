import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
  IconLogout,
} from '@tabler/icons-react';
import { Code, Group, ScrollArea } from '@mantine/core';
import { LinksGroup } from './NavbarLinksGroup';
import classes from '../styles/NavBar.module.css';
import { UserInfo } from './UserInfo';
import logoCCF from '../assets/img/LogoCCF3.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockdata = [
  { label: 'Registrar Ocorrencia', icon: IconNotes, link: '/registroOcorrencia'  },
  { label: 'Relatórios', icon: IconFileAnalytics, link: 'administracao/Relatorios' },
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
  {
    label: 'Administração',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Tipos Ocorrencias', link: '/administracao/TipoOcorrencia' },
      { label: 'RPA', link: '/administracao/RPA' },
      { label: 'Batalhão', link: '/administracao/Batalhao' },
      { label: 'Usuários', link: '/administracao/Users' },
    ],
  },
  { label: 'Configurações', icon: IconAdjustments },
];

export function NavBar2() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <>
      {/* Botão para abrir o menu no mobile */}
      <button
        type="button"
        aria-label="Abrir menu"
        className={classes.toggleButton}
        onClick={() => setIsOpen(true)}
      />

      {/* Backdrop para fechar ao clicar fora no mobile */}
      {isOpen && <div className={classes.backdrop} onClick={() => setIsOpen(false)} />}

      <nav className={`${classes.navbar} ${isOpen ? 'open' : ''}`}>
        <div className={classes.header}>
          <Group justify="space-between">
            <a href="/home">
            <img src={logoCCF} alt="Logo" style={{ width: 60 }} />
            </a>
          </Group>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        {/* Botão para fechar no mobile */}
        <button
          type="button"
          aria-label="Fechar menu"
          className={classes.closeButton}
          onClick={() => setIsOpen(false)}
        />

        <div className={classes.footer}>
          <div className={classes.user}><UserInfo /></div>
          <button
            type="button"
            aria-label="Sair"
            className={classes.logout}
            onClick={() => {
              setIsOpen(false);
              navigate('/login');
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Sair</span>
          </button>
        </div>
      </nav>
    </>
  );
}