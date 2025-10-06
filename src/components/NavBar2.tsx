import { useState } from 'react';
import {
  IconHome,
  IconReport,
  IconPencil,
  IconDashboard,
  IconLogout,
  IconSettings,
  IconMenu2,
  IconMenuDeep
} from '@tabler/icons-react';
import { SegmentedControl} from '@mantine/core';
import classes from '../styles/NavBar2.module.css';
import logoCCF from '../assets/img/LogoCCF3.png';
import { UserInfo } from './UserInfo';

const tabs = {
  account: [
    { link: '', label: 'Início', icon: IconHome },
    { link: '', label: 'Registrar Ocorrência', icon: IconPencil },
    { link: '', label: 'Relatórios', icon: IconReport },
    { link: '', label: 'Dashboard', icon: IconDashboard },
    { link: '', label: 'Configurações', icon: IconSettings },
  ],
  general: [
    { link: '', label: 'Cadastrar Ocorrências', icon: IconPencil },
    { link: '', label: 'Cadastrar Tipos Ocorrências', icon: IconPencil },
    { link: '', label: 'Cadastrar UR', icon: IconPencil },
  ],
};

export function NavBar2() {
  const [section, setSection] = useState<'account' | 'general'>('account');
  const [active, setActive] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);

  const links = tabs[section].map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        setIsOpen(false);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
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
        <button
          type="button"
          aria-label={'Fechar menu'}
          aria-expanded={isOpen}
          className={`${classes.closeButton} ${isOpen ? '' : classes.hidden}`}
          onClick={() => setIsOpen(false)}
        >
          <IconMenuDeep size={22} />
        </button>

        <div>
          <img src={logoCCF} alt="Logo" className={classes.logoCCF}/>
          <SegmentedControl
            value={section}
            onChange={(value: any) => setSection(value)}
            transitionTimingFunction="ease"
            fullWidth
            data={[
              { label: 'Geral', value: 'account' },
              { label: 'Cadastros', value: 'general' },
            ]}
          />
        </div>

        <div className={classes.navbarMain}>{links}</div>

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