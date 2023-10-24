import { Group, ActionIcon, rem } from '@mantine/core';
import { IconBrandTwitter, IconBrandGithub } from '@tabler/icons-react';
import { ReactElement } from 'react';

const styles = {
  footer: {
    marginTop: '120px',
    borderTop:
      '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))',
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--mantine-spacing-md) var(--mantine-spacing-md)',
    '@media (max-width: $mantine-breakpoint-sm)': {
      flexDirection: 'column',
    },
  },
  links: {
    '@media (max-width: $mantine-breakpoint-sm)': {
      marginTop: 'var(--mantine-spacing-lg)',
      marginBottom: 'var(--mantine-spacing-sm)',
    },
  },
};

export function Footer(): ReactElement {
  return (
    <div style={styles.footer}>
      <div style={styles.inner}>
        <p>ALGO V</p>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandGithub
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
