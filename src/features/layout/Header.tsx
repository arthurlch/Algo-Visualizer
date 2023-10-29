import { ReactElement } from 'react';
import { Paper, Flex, Container, Text } from '@mantine/core';

const styles = {
  header: {
    height: '56px',
  },
};

function Header(): ReactElement {
  return (
    <header style={styles.header}>
      <Paper style={{ height: '100%' }}>
        <Container size="md" style={{ height: '100%' }}>
          <Flex align="center" justify="center" style={{ height: '100%' }}>
            <Text size="xl" color="white">
              VISUALIZE DIJKSTRA
            </Text>
          </Flex>
        </Container>
      </Paper>
    </header>
  );
}

export default Header;
