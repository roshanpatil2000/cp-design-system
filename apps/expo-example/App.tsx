import { useState } from 'react';
import { SafeAreaView, ScrollView, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Input,
  Text,
  ThemeProvider,
  VStack,
  darkTheme,
  lightTheme,
} from 'cp-design-system';

export default function App() {
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState('');
  const theme = dark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={dark ? 'dark' : 'light'}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <VStack gap={6}>
            <HStack justify="space-between">
              <Text variant="title">cp-design-system</Text>
              <Switch value={dark} onValueChange={setDark} />
            </HStack>

            <VStack gap={2}>
              <Text variant="subheading">Text</Text>
              <Text variant="heading">Heading</Text>
              <Text>Body text for paragraphs and general content.</Text>
              <Text variant="caption" color="textMuted">
                Caption
              </Text>
            </VStack>

            <VStack gap={2}>
              <Text variant="subheading">Buttons</Text>
              <HStack gap={2} wrap>
                <Button onPress={() => {}}>Solid</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button tone="danger">Delete</Button>
                <Button disabled>Disabled</Button>
              </HStack>
              <Button fullWidth size="lg">
                Full width
              </Button>
            </VStack>

            <VStack gap={2}>
              <Text variant="subheading">Badges</Text>
              <HStack gap={2} wrap>
                <Badge>Neutral</Badge>
                <Badge tone="primary">Primary</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
              </HStack>
            </VStack>

            <VStack gap={3}>
              <Text variant="subheading">Inputs</Text>
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email"
                value={email}
                onChangeText={setEmail}
                helperText="We'll never share it"
              />
              <Input label="Password" secureTextEntry defaultValue="secret" />
              <Input label="With error" defaultValue="oops" error="Something is wrong" />
            </VStack>

            <Card>
              <VStack gap={3}>
                <HStack justify="space-between">
                  <Text variant="subheading">Pro plan</Text>
                  <Badge tone="success">Active</Badge>
                </HStack>
                <Text color="textMuted">
                  Unlimited projects, priority support and team sharing.
                </Text>
                <Box direction="row" gap={2}>
                  <Button size="sm">Manage</Button>
                  <Button size="sm" variant="ghost" tone="danger">
                    Cancel
                  </Button>
                </Box>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}
