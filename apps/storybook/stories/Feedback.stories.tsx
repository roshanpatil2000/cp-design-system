import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Banner,
  Box,
  Button,
  EmptyState,
  Heading,
  Icon,
  Inline,
  Lozenge,
  ProgressBar,
  ProgressIndicator,
  SectionMessage,
  Skeleton,
  Spinner,
  Stack,
  Tag,
  Text,
  type TagColor,
} from 'cp-design-system';

const meta = { title: 'Feedback/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Spinners: Story = {
  render: () => (
    <Inline space="300" alignBlock="center">
      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((s) => (
        <Spinner key={s} size={s} />
      ))}
      <Box padding="200" backgroundColor="color.background.neutral.bold" borderRadius="medium">
        <Spinner appearance="invert" />
      </Box>
    </Inline>
  ),
};

function Uploading() {
  const [value, setValue] = useState(0.1);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 1 ? 0 : Math.min(1, v + 0.15))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <Stack space="300">
      <Stack space="100">
        <Text>Uploading report… {Math.round(value * 100)}%</Text>
        <ProgressBar value={value} label="Uploading report" />
      </Stack>
      <ProgressBar value={0.7} appearance="success" />
      <ProgressBar value={0.4} appearance="brand" />
      <Stack space="100">
        <Text>Indeterminate</Text>
        <ProgressBar isIndeterminate label="Loading" />
      </Stack>
    </Stack>
  );
}

export const ProgressBars: Story = { render: () => <Uploading /> };

function Steps() {
  const [i, setI] = useState(0);
  return (
    <Stack space="200" alignInline="start">
      <ProgressIndicator count={5} selectedIndex={i} onSelect={setI} appearance="primary" />
      <ProgressIndicator count={5} selectedIndex={i} size="large" spacing="cozy" />
      <Inline space="100">
        <Button onPress={() => setI((v) => Math.max(0, v - 1))}>Back</Button>
        <Button appearance="primary" onPress={() => setI((v) => Math.min(4, v + 1))}>
          Next
        </Button>
      </Inline>
    </Stack>
  );
}

export const ProgressIndicators: Story = { render: () => <Steps /> };

export const Lozenges: Story = {
  render: () => (
    <Stack space="150">
      {[false, true].map((bold) => (
        <Inline key={String(bold)} space="100">
          {(['default', 'inprogress', 'moved', 'new', 'removed', 'success'] as const).map((a) => (
            <Lozenge key={a} appearance={a} isBold={bold}>
              {a}
            </Lozenge>
          ))}
        </Inline>
      ))}
    </Stack>
  ),
};

function Counter() {
  const [n, setN] = useState(3);
  return (
    <Stack space="200" alignInline="start">
      <Inline space="150" alignBlock="center">
        {(['default', 'primary', 'important', 'added', 'removed'] as const).map((a) => (
          <Badge key={a} appearance={a}>
            {n}
          </Badge>
        ))}
        <Badge appearance="primary">{150}</Badge>
      </Inline>
      <Button onPress={() => setN((v) => v + 1)}>Add one (watch them pop)</Button>
    </Stack>
  );
}

export const Badges: Story = { render: () => <Counter /> };

const colors: TagColor[] = [
  'standard',
  'blue',
  'green',
  'teal',
  'purple',
  'red',
  'yellow',
  'orange',
  'magenta',
  'lime',
  'gray',
];

function Tags() {
  const [tags, setTags] = useState(['Design', 'Frontend', 'Accessibility', 'Motion']);
  return (
    <Stack space="200">
      <Inline space="100" shouldWrap>
        {colors.map((c) => (
          <Tag key={c} text={c} color={c} />
        ))}
      </Inline>
      <Inline space="100" shouldWrap>
        {tags.map((t) => (
          <Tag
            key={t}
            text={t}
            appearance="rounded"
            color="blue"
            isRemovable
            onRemove={() => setTags((all) => all.filter((x) => x !== t))}
          />
        ))}
      </Inline>
    </Stack>
  );
}

export const Tags_: Story = { name: 'Tags', render: () => <Tags /> };

function Banners() {
  const [open, setOpen] = useState(true);
  return (
    <Stack space="200">
      <Banner appearance="warning" isOpen={open}>
        Your trial ends in 3 days.
      </Banner>
      <Banner appearance="error">We’re having trouble connecting. Changes may not save.</Banner>
      <Banner appearance="announcement">New: dark mode is here.</Banner>
      <Box>
        <Button onPress={() => setOpen((v) => !v)}>{open ? 'Hide' : 'Show'} warning</Button>
      </Box>
    </Stack>
  );
}

export const Banners_: Story = { name: 'Banners', render: () => <Banners /> };

export const SectionMessages: Story = {
  render: () => (
    <Stack space="200">
      {(['information', 'success', 'warning', 'error', 'discovery'] as const).map((a) => (
        <SectionMessage
          key={a}
          appearance={a}
          title={`${a[0]!.toUpperCase()}${a.slice(1)} message`}
          actions={[
            { content: 'Primary action', onPress: () => {} },
            { content: 'Learn more', onPress: () => {} },
          ]}
        >
          A short explanation of what happened and what to do next.
        </SectionMessage>
      ))}
    </Stack>
  ),
};

function Loading() {
  const [loaded, setLoaded] = useState(false);
  return (
    <Stack space="300" alignInline="start">
      <Button onPress={() => setLoaded((v) => !v)}>{loaded ? 'Show skeleton' : 'Load'}</Button>
      <Box
        padding="200"
        borderColor="color.border"
        borderWidth="default"
        borderRadius="large"
        style={{ width: 360 }}
      >
        {loaded ? (
          <Inline space="200" alignBlock="center">
            <Box
              backgroundColor="color.background.brand.bold"
              borderRadius="full"
              style={{ width: 40, height: 40 }}
            />
            <Stack space="050">
              <Heading size="xsmall" as="div">
                Roshan Patil
              </Heading>
              <Text size="small" color="color.text.subtle">
                Updated the design tokens
              </Text>
            </Stack>
          </Inline>
        ) : (
          <Inline space="200" alignBlock="center">
            <Skeleton width={40} height={40} borderRadius="full" />
            <Stack space="100" grow="fill">
              <Skeleton width={140} height={14} />
              <Skeleton width={220} height={12} />
            </Stack>
          </Inline>
        )}
      </Box>
    </Stack>
  );
}

export const Skeletons: Story = { render: () => <Loading /> };

export const EmptyStates: Story = {
  render: () => (
    <EmptyState
      image={<Icon glyph="info" size={48} color="color.icon.subtle" />}
      header="No projects yet"
      description="Projects group your work. Create one to get started, or import from another tool."
      primaryAction={<Button appearance="primary">Create project</Button>}
      secondaryAction={<Button>Import</Button>}
    />
  ),
};
