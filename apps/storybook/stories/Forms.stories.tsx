import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Range, Select, Stack, Text, TextArea, Toggle } from 'cp-design-system';

const meta = { title: 'Forms/More fields' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
  { value: 'free', label: 'Free' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise (contact sales)', isDisabled: true },
];

function SelectDemo() {
  const [plan, setPlan] = useState<string | null>(null);
  return (
    <Stack space="300" style={{ maxWidth: 320 }}>
      <Select
        label="Plan"
        isRequired
        options={plans}
        value={plan}
        onChange={setPlan}
        isInvalid={plan === null}
        errorMessage="Choose a plan to continue"
        validMessage={plan ? 'Good choice' : undefined}
      />
      <Select
        label="Region"
        options={[
          { value: 'eu', label: 'Europe' },
          { value: 'us', label: 'United States' },
        ]}
        defaultValue="eu"
      />
      <Select label="Disabled" options={plans} isDisabled />
    </Stack>
  );
}

export const Selects: Story = { render: () => <SelectDemo /> };

export const TextAreas: Story = {
  render: () => (
    <Stack space="300" style={{ maxWidth: 420 }}>
      <TextArea
        label="Description"
        placeholder="What is this project about?"
        helperMessage="Grows as you type"
      />
      <TextArea label="Tweet" maxCharacters={140} minimumRows={2} />
      <TextArea label="Notes" isInvalid errorMessage="Notes are required" isRequired />
      <TextArea
        label="Code"
        isMonospaced
        defaultValue={'const theme = createTheme({\n  brand: "#7C3AED",\n});'}
      />
    </Stack>
  ),
};

function RangeDemo() {
  const [volume, setVolume] = useState(40);
  return (
    <Stack space="300" style={{ maxWidth: 320 }}>
      <Field label={`Volume: ${volume}%`}>
        <Range label="Volume" value={volume} onChange={setVolume} formatValue={(v) => `${v}%`} />
      </Field>
      <Field label="Rating (steps of 1, 0–5)">
        <Range label="Rating" min={0} max={5} defaultValue={3} />
      </Field>
      <Field label="Disabled">
        <Range label="Disabled" defaultValue={70} isDisabled />
      </Field>
    </Stack>
  );
}

export const Ranges: Story = { render: () => <RangeDemo /> };

export const Fields: Story = {
  render: () => (
    <Stack space="300" style={{ maxWidth: 320 }}>
      <Field label="Email updates" helperMessage="We send at most one email a week.">
        <Toggle label="Email updates" defaultChecked />
      </Field>
      <Field label="Website" isRequired isInvalid errorMessage="Enter a valid URL">
        {(f) => (
          <input
            id={f.id}
            aria-describedby={f['aria-describedby']}
            aria-invalid={f['aria-invalid']}
            defaultValue="not a url"
            style={{ height: 32, padding: '0 8px' }}
          />
        )}
      </Field>
      <Text size="small" color="color.text.subtle">
        Field adds a label and message to any control, wired up for screen readers.
      </Text>
    </Stack>
  ),
};
