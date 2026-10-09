import { useState, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { motion } from 'motion/react';
import {
  atlassianBlueRamp,
  contrastRatio,
  createBrandRamp,
  resolveSpring,
  useReducedMotion,
  useTheme,
  type BrandStep,
  type SpringName,
  type ThemeColor,
} from 'cp-design-system';

const meta = { title: 'Foundations/Theme' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: theme.text['heading.small'].fontSize,
          lineHeight: `${theme.text['heading.small'].lineHeight}px`,
          fontWeight: theme.text['heading.small'].fontWeight,
          margin: '0 0 12px',
          color: theme.color['color.text'],
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ color, label, sub }: { color: string; label: string; sub?: string }) {
  const theme = useTheme();
  return (
    <div style={{ width: 120 }}>
      <div
        style={{
          height: 48,
          borderRadius: theme.radius.medium,
          background: color,
          border: `1px solid ${theme.color['color.border']}`,
        }}
      />
      <div style={{ fontSize: 12, marginTop: 4, color: theme.color['color.text'] }}>{label}</div>
      <div style={{ fontSize: 11, color: theme.color['color.text.subtlest'] }}>{sub ?? color}</div>
    </div>
  );
}

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 12 };

function BrandRamp() {
  const theme = useTheme();
  const [brand, setBrand] = useState('#7C3AED');
  const valid = /^#[0-9a-f]{6}$/i.test(brand);
  const ramp = valid ? createBrandRamp(brand) : null;
  return (
    <>
      <Section title="Atlassian Blue ramp (reference)">
        <div style={row}>
          {(Object.keys(atlassianBlueRamp) as BrandStep[]).map((step) => (
            <Swatch key={step} color={atlassianBlueRamp[step]} label={step} />
          ))}
        </div>
      </Section>
      <Section title="Your brand ramp">
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <input
            type="color"
            value={valid ? brand : '#000000'}
            onChange={(e) => setBrand(e.target.value.toUpperCase())}
          />
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{ width: 100, color: theme.color['color.text'], background: 'transparent' }}
          />
          <span style={{ fontSize: 12, color: theme.color['color.text.subtle'] }}>
            Step 700 is your exact color (light-mode bold brand). Step 400 is the dark-mode bold
            brand.
          </span>
        </label>
        {ramp && (
          <div style={row}>
            {(Object.keys(ramp) as BrandStep[]).map((step) => (
              <Swatch key={step} color={ramp[step]} label={step} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

const semantic: ThemeColor[] = [
  'color.background.brand.bold',
  'color.background.brand.bold.hovered',
  'color.background.brand.bold.pressed',
  'color.background.brand.subtlest',
  'color.background.selected',
  'color.border.focused',
  'color.text.brand',
  'color.link',
  'color.background.neutral',
  'color.background.input',
  'color.border.input',
  'color.text',
  'color.text.subtle',
  'color.background.success.bold',
  'color.background.warning.bold',
  'color.background.danger.bold',
  'color.background.discovery.bold',
  'color.background.information.bold',
];

function SemanticColors() {
  const theme = useTheme();
  const bold = theme.color['color.background.brand.bold'];
  const onBrand = theme.color['color.text.onBrand'];
  return (
    <Section title={`Semantic colors (${theme.name}, ${theme.mode})`}>
      <div style={row}>
        {semantic.map((token) => (
          <Swatch
            key={token}
            color={theme.color[token]}
            label={token.replace('color.', '')}
            sub={theme.color[token]}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          display: 'inline-block',
          padding: '8px 12px',
          borderRadius: theme.radius.medium,
          background: bold,
          color: onBrand,
          fontWeight: 600,
        }}
      >
        Text on brand: contrast {contrastRatio(bold, onBrand).toFixed(1)}:1
      </div>
    </Section>
  );
}

function Scales() {
  const theme = useTheme();
  return (
    <>
      <Section title="Spacing">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(theme.space)
            .filter(([k]) => !k.startsWith('negative'))
            .map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <code style={{ width: 80, fontSize: 12 }}>space.{k}</code>
                <div
                  style={{
                    width: v,
                    height: 12,
                    background: theme.color['color.background.brand.bold'],
                    borderRadius: 2,
                  }}
                />
                <span style={{ fontSize: 12, color: theme.color['color.text.subtle'] }}>{v}px</span>
              </div>
            ))}
        </div>
      </Section>
      <Section title="Radius">
        <div style={row}>
          {Object.entries(theme.radius).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center', fontSize: 12 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: Math.min(v, 32),
                  border: `2px solid ${theme.color['color.border.brand']}`,
                  background: theme.color['color.background.brand.subtlest'],
                }}
              />
              {k} · {v}
            </div>
          ))}
        </div>
      </Section>
      <Section title="Typography">
        {Object.entries(theme.text).map(([name, style]) => (
          <div
            key={name}
            style={{
              fontSize: style.fontSize,
              lineHeight: `${style.lineHeight}px`,
              fontWeight: style.fontWeight,
              marginBottom: 4,
            }}
          >
            {name} · {style.fontSize}/{style.lineHeight}
          </div>
        ))}
      </Section>
    </>
  );
}

function SpringDemo() {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const [on, setOn] = useState(false);
  return (
    <Section title={`Springs ${reduced ? '(motion reduced: instant)' : ''}`}>
      <button
        onClick={() => setOn((v) => !v)}
        style={{
          marginBottom: 12,
          padding: '6px 12px',
          borderRadius: theme.radius.medium,
          border: 'none',
          background: theme.color['color.background.brand.bold'],
          color: theme.color['color.text.onBrand'],
          cursor: 'pointer',
        }}
      >
        Animate
      </button>
      {(Object.keys(theme.motion.springs) as SpringName[]).map((name) => {
        const spring = resolveSpring(theme, reduced, name);
        return (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}
          >
            <code style={{ width: 70, fontSize: 12 }}>{name}</code>
            <div
              style={{
                width: 320,
                height: 32,
                background: theme.color['color.background.neutral'],
                borderRadius: theme.radius.full,
                position: 'relative',
              }}
            >
              <motion.div
                animate={{ x: on ? 288 : 0 }}
                transition={spring ? { type: 'spring', ...spring } : { duration: 0 }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: theme.radius.full,
                  background: theme.color['color.background.brand.bold'],
                }}
              />
            </div>
          </div>
        );
      })}
    </Section>
  );
}

export const BrandRamps: Story = { render: () => <BrandRamp /> };
export const Colors: Story = { render: () => <SemanticColors /> };
export const SpacingRadiusType: Story = {
  name: 'Spacing, radius & type',
  render: () => <Scales />,
};
export const Motion: Story = { render: () => <SpringDemo /> };
