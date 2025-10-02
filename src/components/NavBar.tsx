import { useState } from 'react';
import {
  IconHome,
  IconReport,
  IconDashboard,
  IconLogout,
  IconPencil,
  IconSettings,
  IconMenu2,
  IconMenuDeep,
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import logoCCF from '../assets/img/LogoCCF3.png';
import classes from '../styles/NavBar.module.css';
import { UserInfo } from './UserInfo';

const data = [
  { link: '', label: 'Home', icon: IconHome },
  { link: '', label: 'Cadastros', icon: IconPencil },
  { link: '', label: 'Relatórios', icon: IconReport },
  { link: '', label: 'Dashboard', icon: IconDashboard },
  { link: '', label: 'Configurações', icon: IconSettings },
];

export function NavBar() {
  const [active, setActive] = useState('Billing');
  const [isOpen, setIsOpen] = useState(false);

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        // Fecha o menu no mobile após clicar
        setIsOpen(false);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
      {/* Botão hamburger para mobile (aparece apenas quando fechado) */}
      {!isOpen && (
        <button
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          className={classes.toggleButton}
          onClick={() => setIsOpen(true)}
        >
          <IconMenu2 size={22} />
        </button>
      )}

      {/* Backdrop para mobile */}
      {isOpen && <div className={classes.backdrop} onClick={() => setIsOpen(false)} />}

      <nav className={`${classes.navbar} ${isOpen ? classes.open : ''}`}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            <img src={logoCCF} alt="Logo" className={classes.logoCCF}/>
            <Code fw={700}>v0.0.1</Code>
            {/* Botão de fechar dentro do menu (visível no mobile) */}
            <button
              type="button"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
              className={`${classes.toggleButton} ${isOpen ? classes.hidden : ''}`}
              onClick={() => setIsOpen(true)}
              >
              <IconMenuDeep size={22} />
            </button>
          </Group>
          {links}
        </div>

        <div className={classes.footer}>
          <UserInfo />
          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Sair</span>
          </a>
        </div>
      </nav>
    </>
  );
}