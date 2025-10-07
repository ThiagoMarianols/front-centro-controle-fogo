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
import { SegmentedControl } from '@mantine/core';
import classes from '../styles/NavBar2.module.css';
import logoCCF from '../assets/img/LogoCCF3.png';
import { UserInfo } from './UserInfo';
import { useNavigate } from 'react-router-dom';

const tabs = {
  account: [
    { link: '/home', label: 'Início', icon: IconHome },
    { link: '/registroOcorrencia', label: 'Registrar Ocorrência', icon: IconPencil },
    { link: '/relatorios', label: 'Relatórios', icon: IconReport },
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { link: '/configuracoes', label: 'Configurações', icon: IconSettings },
    { link: '/Users', label: 'Usuário', icon: IconPencil },
  ],
  general: [
    { link: '/cadastros/ocorrencias', label: 'Cadastrar Ocorrências', icon: IconPencil },
    { link: '/cadastros/tipos-ocorrencias', label: 'Cadastrar Tipos Ocorrências', icon: IconPencil },
    { link: '/cadastros/ur', label: 'Cadastrar UR', icon: IconPencil },
    { link: '/CadastroUsuario', label: 'Cadastrar Usuário', icon: IconPencil },

  ],
};

export function NavBar2() {
  const [section, setSection] = useState<'account' | 'general'>('account');
  const [active, setActive] = useState('Início');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
        window.location.href = item.link; // redireciona corretamente
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

      {isOpen && <div className={classes.backdrop} onClick={() => setIsOpen(false)} />}

      <nav className={`${classes.navbar} ${isOpen ? classes.open : ''}`}>
        <button
          type="button"
          aria-label="Fechar menu"
          aria-expanded={isOpen}
          className={`${classes.closeButton} ${isOpen ? '' : classes.hidden}`}
          onClick={() => setIsOpen(false)}
        >
          <IconMenuDeep size={22} />
        </button>

        <div>
          <img src={logoCCF} alt="Logo" className={classes.logoCCF} />
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
          <a
            href="/login"
            className={classes.link}
            onClick={(event) => {
              event.preventDefault();
              // lógica de logout pode ser adicionada aqui (ex.: limpar tokens)
              setIsOpen(false);
              navigate('/login');
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Sair</span>
          </a>
        </div>
      </nav>
    </>
  );
}

