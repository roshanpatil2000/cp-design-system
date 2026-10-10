import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, TextField, ThemeProvider, createTheme, useTheme } from 'cp-design-system';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Email', placeholder: 'you@example.com', helperMessage: "We'll never share it." },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['standard', 'subtle', 'none'] },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    width: {
      control: 'select',
      options: [undefined, 'xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

function Stack({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>{children}</div>;
}

export const Playground: Story = {};

export const Appearances: Story = {
  render: () => (
    <Stack>
      <TextField label="Standard" placeholder="Bordered" />
      <TextField label="Subtle" appearance="subtle" placeholder="Border on hover and focus" />
      <TextField label="None" appearance="none" placeholder="No border at all" />
      <TextField label="Compact" isCompact placeholder="32px tall" />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack>
      <TextField label="Required" isRequired placeholder="Can't be empty" />
      <TextField label="Disabled" isDisabled defaultValue="Can't edit me" />
      <TextField label="Read-only" isReadOnly defaultValue="ROSHAN-2026" isMonospaced />
      <TextField
        label="Invalid"
        isInvalid
        defaultValue="not-an-email"
        errorMessage="Enter a valid email address"
      />
      <TextField label="Valid" defaultValue="roshan@example.com" validMessage="Available" />
    </Stack>
  ),
};

function ValidationDemo() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <Stack>
      <TextField
        label="Work email"
        isRequired
        type="email"
        value={email}
        onChange={(v) => {
          setEmail(v);
          setSubmitted(false);
        }}
        onSubmit={() => setSubmitted(true)}
        helperMessage="Press Enter or Continue to validate"
        isInvalid={invalid}
        errorMessage={email ? 'That doesn’t look like an email address' : 'Email is required'}
        validMessage={submitted && !invalid ? 'Looks good' : undefined}
      />
      <div>
        <Button appearance="primary" onPress={() => setSubmitted(true)}>
          Continue
        </Button>
      </div>
    </Stack>
  );
}

export const Validation: Story = {
  name: 'Validation (shake + messages)',
  render: () => <ValidationDemo />,
};

export const Counter: Story = {
  name: 'Character counter',
  render: () => (
    <Stack>
      <TextField label="Display name" maxCharacters={20} defaultValue="Roshan" />
      <TextField
        label="Bio"
        minCharacters={10}
        maxCharacters={60}
        placeholder="At least 10 characters"
      />
    </Stack>
  ),
};

function SearchIcon() {
  const theme = useTheme();
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle
        cx="7"
        cy="7"
        r="4.5"
        stroke={theme.color['color.icon.subtle']}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10.5 10.5L14 14"
        stroke={theme.color['color.icon.subtle']}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchDemo() {
  const [q, setQ] = useState('design tokens');
  return (
    <TextField
      accessibilityLabel="Search"
      type="search"
      width="large"
      placeholder="Search"
      value={q}
      onChange={setQ}
      elemBeforeInput={<SearchIcon />}
      elemAfterInput={
        q ? (
          <Button appearance="subtle" spacing="compact" onPress={() => setQ('')}>
            Clear
          </Button>
        ) : undefined
      }
    />
  );
}

export const WithElements: Story = {
  name: 'Elements before and after',
  render: () => <SearchDemo />,
};

export const Widths: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((w) => (
        <TextField key={w} accessibilityLabel={w} width={w} placeholder={w} />
      ))}
    </div>
  ),
};

const rounded = createTheme({
  brand: '#7C3AED',
  components: {
    TextField: {
      tokens: (theme) => ({
        radius: 12,
        height: 48,
        paddingX: 12,
        background: theme.color['color.background.neutral'],
        border: 'transparent',
        shakeDistance: 8,
      }),
    },
  },
});

export const BrandCustomized: Story = {
  name: 'Fully customized (theme-level)',
  render: () => (
    <ThemeProvider theme={rounded}>
      <Stack>
        <TextField
          label="Filled, 48px, rounded"
          placeholder="Focus me: the ring is your brand color"
        />
        <TextField
          label="Bigger shake"
          isInvalid
          errorMessage="8px shake via shakeDistance"
          defaultValue="oops"
        />
      </Stack>
    </ThemeProvider>
  ),
};
