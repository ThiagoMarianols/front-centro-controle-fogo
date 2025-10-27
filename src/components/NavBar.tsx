import {
  IconAdjustments,
  IconFileAnalytics,
  IconGauge,
  IconNotes,
  IconLogout,
} from '@tabler/icons-react';
import { Group, ScrollArea } from '@mantine/core';
import { LinksGroup } from './NavbarLinksGroup';
import classes from '../styles/NavBar.module.css';
import { UserInfo } from './UserInfo';
import logoCCF from '../assets/img/LogoCCF3.png';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
const mockdata = [
  { label: 'Ocorrencias', icon: IconNotes, link: '/Ocorrencia'  },
  { label: 'Relatórios', icon: IconFileAnalytics, link: 'administracao/Relatorios' },
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
  {
    label: 'Administração',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Tipos Ocorrencias', link: '/administracao/TipoOcorrencia' },
      { label: 'Batalhão', link: '/administracao/Batalhao' },
      { label: 'Usuários', link: '/administracao/Users' },
    ],
  },
  { label: 'Configurações', icon: IconAdjustments },
];

export function NavBar2() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} onClick={() => isMobile && setIsOpen(false)} />);

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adiciona/remove classe no body quando o menu é aberto/fechado
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
    
    // Impede o scroll da página quando o menu está aberto em mobile
    if (isMobile) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    return () => {
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Botão para abrir o menu no mobile - só aparece quando o menu está fechado */}
      {!isOpen && (
        <button
          type="button"
          aria-label="Abrir menu"
          className={classes.toggleButton}
          onClick={() => setIsOpen(true)}
        />
      )}

      {/* Backdrop para fechar ao clicar fora no mobile */}
      {isOpen && <div className={classes.backdrop} onClick={() => setIsOpen(false)} />}

      <nav className={`${classes.navbar} ${isOpen ? classes.open : ''}`}>
        <div className={classes.header}>
          <Group justify="space-between">
            <Link to="/">
              <img src={logoCCF} alt="Logo" style={{ width: 60 }} />
            </Link>
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