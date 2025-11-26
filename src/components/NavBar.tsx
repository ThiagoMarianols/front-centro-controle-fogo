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
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { logoutService } from '../services/authService';
import { usePermissions } from '../hooks/usePermissions';
import type { UserRole } from '../types/permissions';

interface NavItem {
  label: string;
  icon: React.FC<any>;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string; allowedRoles?: UserRole[] }[];
  allowedRoles?: UserRole[];
}

const allNavItems: NavItem[] = [
  { label: 'Ocorrencias', icon: IconNotes, link: '/Ocorrencia' },
  { label: 'Relatórios', icon: IconFileAnalytics, link: 'administracao/Relatorios', allowedRoles: ['ADMINISTRADOR', 'OBSERVADOR'] },
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard', allowedRoles: ['ADMINISTRADOR', 'OBSERVADOR'] },
  {
    label: 'Administração',
    icon: IconNotes,
    initiallyOpened: true,
    allowedRoles: ['ADMINISTRADOR', 'OBSERVADOR'],
    links: [
      { label: 'Batalhão', link: '/administracao/Batalhao', allowedRoles: ['ADMINISTRADOR', 'OBSERVADOR'] },
      { label: 'Veículos', link: '/administracao/Veiculo', allowedRoles: ['ADMINISTRADOR', 'OBSERVADOR'] },
      { label: 'Usuários', link: '/administracao/Users', allowedRoles: ['ADMINISTRADOR', 'OBSERVADOR'] },
    ],
  },
];

export function NavBar2() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { userRoles } = usePermissions();

  const filteredNavItems = useMemo(() => {
    // Função local para verificar roles
    const checkRoles = (allowedRoles?: UserRole[]): boolean => {
      // Se não tem restrição de role, permite acesso
      if (!allowedRoles) return true;
      // Se o usuário ainda não foi carregado, mostra todos os itens
      if (userRoles.length === 0) return true;
      // Verifica se o usuário tem alguma das roles permitidas
      return allowedRoles.some(role => userRoles.includes(role));
    };

    return allNavItems
      .filter((item) => checkRoles(item.allowedRoles))
      .map((item) => {
        // Filtra também os sublinks
        if (item.links) {
          return {
            ...item,
            links: item.links.filter((link) => checkRoles(link.allowedRoles)),
          };
        }
        return item;
      })
      // Remove itens de menu que ficaram sem sublinks
      .filter((item) => !item.links || item.links.length > 0);
  }, [userRoles]);

  const links = filteredNavItems.map((item) => (
    <LinksGroup {...item} key={item.label} onClick={() => isMobile && setIsOpen(false)} />
  ));

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
            onClick={async () => {
              const response = await logoutService();
              if (response === 200) {
                localStorage.clear();
                navigate('/login');
              }
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