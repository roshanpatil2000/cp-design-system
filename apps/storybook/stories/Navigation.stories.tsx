import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, Pagination, Stack, Tabs, Text } from 'cp-design-system';

const meta = { title: 'Navigation/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TabsStory: Story = {
  name: 'Tabs',
  render: () => (
    <Stack space="400">
      <Tabs
        label="Project"
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            content: <Text>Project summary, goals and owners.</Text>,
          },
          { id: 'issues', label: 'Issues', content: <Text>142 open issues across 6 epics.</Text> },
          { id: 'releases', label: 'Releases', content: <Text>v2.4 ships next Tuesday.</Text> },
          { id: 'archived', label: 'Archived', isDisabled: true },
          {
            id: 'settings',
            label: 'Settings',
            content: <Text>Permissions and integrations.</Text>,
          },
        ]}
      />
      <Tabs
        shouldFitContainer
        tabs={[
          { id: 'day', label: 'Day', content: <Text>Today</Text> },
          { id: 'week', label: 'Week', content: <Text>This week</Text> },
          { id: 'month', label: 'Month', content: <Text>This month</Text> },
        ]}
      />
    </Stack>
  ),
};

export const BreadcrumbsStory: Story = {
  name: 'Breadcrumbs',
  render: () => (
    <Stack space="300">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '#home' },
          { label: 'Projects', href: '#projects' },
          { label: 'Design system', href: '#ds' },
        ]}
      />
      <Breadcrumbs
        maxItems={4}
        items={[
          'Home',
          'Spaces',
          'Engineering',
          'Platform',
          'Design system',
          'Components',
          'Tabs',
        ].map((label) => ({ label, href: `#${label}` }))}
      />
    </Stack>
  ),
};

function PaginationDemo() {
  const [page, setPage] = useState(4);
  return (
    <Stack space="200">
      <Pagination pages={20} selectedIndex={page} onChange={setPage} />
      <Text size="small" color="color.text.subtle">
        Page {page + 1} of 20
      </Text>
      <Pagination pages={5} />
    </Stack>
  );
}

export const PaginationStory: Story = { name: 'Pagination', render: () => <PaginationDemo /> };
