import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Carousel, Heading, Lozenge, Stack, Text } from 'cp-design-system';

const projects = [
  {
    name: 'Design system',
    status: 'inprogress',
    color: 'color.background.accent.purple.subtler',
    text: '40 components across web and native.',
  },
  {
    name: 'Mobile app',
    status: 'success',
    color: 'color.background.accent.blue.subtler',
    text: 'Shipping to the App Store next week.',
  },
  {
    name: 'Billing',
    status: 'moved',
    color: 'color.background.accent.yellow.subtler',
    text: 'Waiting on the payments team.',
  },
  {
    name: 'Onboarding',
    status: 'new',
    color: 'color.background.accent.green.subtler',
    text: 'Research starts on Monday.',
  },
] as const;

function Card({ p }: { p: (typeof projects)[number] }) {
  return (
    <Box padding="300" backgroundColor={p.color} borderRadius="xlarge" style={{ height: 180 }}>
      <Stack space="150">
        <Lozenge appearance={p.status}>
          {p.status === 'inprogress' ? 'In progress' : p.status}
        </Lozenge>
        <Heading size="medium" as="div">
          {p.name}
        </Heading>
        <Text color="color.text.subtle">{p.text}</Text>
      </Stack>
    </Box>
  );
}

const meta = { title: 'Display/Carousel', component: Carousel } satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Peek: Story = {
  name: 'Peeking slides (drag me)',
  args: { label: 'Projects', slideWidth: '80%', children: null },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Carousel {...args}>
        {projects.map((p) => (
          <Card key={p.name} p={p} />
        ))}
      </Carousel>
    </div>
  ),
};

export const FullWidth: Story = {
  name: 'Full width, looping autoplay',
  args: { label: 'Highlights', loop: true, autoPlay: 3000, children: null },
  render: Peek.render,
};

export const DotsOnly: Story = {
  name: 'Dots only',
  args: { label: 'Tips', showArrows: false, slideWidth: '90%', space: '100', children: null },
  render: Peek.render,
};
