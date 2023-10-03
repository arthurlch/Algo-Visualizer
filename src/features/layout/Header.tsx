import { Menu, Group, Center, Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { ReactElement } from 'react';

const styles = {
  header: {
    height: '56px',
    marginBottom: '120px',
    backgroundColor: 'var(--mantine-color-body)',
    borderBottom:
      '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
  },
  inner: {
    height: '56px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: 'var(--mantine-radius-sm)',
    textDecoration: 'none',
    color:
      'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
    fontSize: 'var(--mantine-font-size-sm)',
    fontWeight: 500,
    '&:hover': {
      backgroundColor:
        'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
    },
  },
  linkLabel: {
    marginRight: '5px',
  },
};

const links = [
  { link: '/about', label: 'Features' },
  {
    link: '#1',
    label: 'Learn',
    links: [
      { link: '/docs', label: 'Documentation' },
      { link: '/resources', label: 'Resources' },
      { link: '/community', label: 'Community' },
      { link: '/blog', label: 'Blog' },
    ],
  },
];

function Header(): ReactElement {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems !== null) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              key={link.label}
              href={link.link}
              style={styles.link}
              onClick={(event): void => event.preventDefault()}
            >
              <Center>
                <span style={styles.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        style={styles.link}
        onClick={(event): void => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header style={styles.header}>
      <Container size="md">
        <div style={styles.inner}>
          ALGO V
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}

export default Header;
