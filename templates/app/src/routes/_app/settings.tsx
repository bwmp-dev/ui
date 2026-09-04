import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {
  Button,
  Field,
  Input,
  Page,
  PageHeader,
  RadioGroup,
  SettingsSection,
  Switch,
  Tabs,
  useTheme,
  useToast,
} from '@bwmp-dev/ui'
import { useLocalStorage } from '@bwmp-dev/hooks'
import { useAuth } from '~/features/auth/auth-context'

const searchSchema = z.object({
  tab: z.enum(['profile', 'appearance', 'notifications']).default('profile'),
})

export const Route = createFileRoute('/_app/settings')({
  validateSearch: searchSchema,
  component: SettingsPage,
})

/**
 * Tab state lives in the URL, so a settings tab can be linked to and survives a
 * reload. `Tabs` itself stays uncontrolled-looking; the router is the state.
 */
function SettingsPage() {
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <Page width="content">
      <PageHeader
        title="Settings"
        description="Preferences apply to your account on this device."
        below={
          <Tabs
            value={tab}
            onValueChange={(value) => void navigate({ search: { tab: value as typeof tab } })}
          >
            <Tabs.List>
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
              <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        }
      />

      {tab === 'profile' ? <ProfileSettings /> : null}
      {tab === 'appearance' ? <AppearanceSettings /> : null}
      {tab === 'notifications' ? <NotificationSettings /> : null}
    </Page>
  )
}

function ProfileSettings() {
  const { user } = useAuth()
  const toast = useToast()

  return (
    <SettingsSection
      title="Profile"
      description="How you appear to the rest of your team."
      footer={
        <Button
          variant="primary"
          onClick={() => toast.add({ title: 'Profile saved', type: 'success' })}
        >
          Save changes
        </Button>
      }
    >
      <Field name="name">
        <Field.Label>Display name</Field.Label>
        <Input defaultValue={user?.name} />
      </Field>
      <Field name="email">
        <Field.Label>Email</Field.Label>
        <Input type="email" defaultValue={user?.email} disabled />
        <Field.Description>Contact an administrator to change your email.</Field.Description>
      </Field>
    </SettingsSection>
  )
}

function AppearanceSettings() {
  const { appearance, setAppearance, density, setDensity, theme, setTheme } = useTheme()

  return (
    <SettingsSection
      title="Appearance"
      description="Colour scheme, information density and brand. Saved locally and applied immediately."
    >
      <Field name="appearance">
        <Field.Label>Colour scheme</Field.Label>
        <RadioGroup
          orientation="horizontal"
          value={appearance}
          onValueChange={(value) => setAppearance(value as typeof appearance)}
        >
          <RadioGroup.Item value="system" label="System" />
          <RadioGroup.Item value="light" label="Light" />
          <RadioGroup.Item value="dark" label="Dark" />
        </RadioGroup>
      </Field>

      <Field name="density">
        <Field.Label>Density</Field.Label>
        <RadioGroup
          orientation="horizontal"
          value={density}
          onValueChange={(value) => setDensity(value as typeof density)}
        >
          <RadioGroup.Item value="comfortable" label="Comfortable" />
          <RadioGroup.Item value="compact" label="Compact" />
        </RadioGroup>
        <Field.Description>
          Compact tightens control heights and row spacing without changing type or colour.
        </Field.Description>
      </Field>

      <Field name="theme">
        <Field.Label>Brand</Field.Label>
        <RadioGroup
          orientation="horizontal"
          value={theme ?? 'default'}
          onValueChange={(value) => setTheme(value === 'default' ? undefined : (value as string))}
        >
          <RadioGroup.Item value="default" label="Default" />
          <RadioGroup.Item value="provenance" label="Provenance" />
          <RadioGroup.Item value="summa" label="Summa" />
          <RadioGroup.Item value="mochi" label="Mochi" />
        </RadioGroup>
        <Field.Description>
          Demonstrates `data-theme`. A real project ships one brand and drops this control.
        </Field.Description>
      </Field>
    </SettingsSection>
  )
}

function NotificationSettings() {
  const [prefs, setPrefs] = useLocalStorage('settings:notifications', {
    deviceOffline: true,
    weeklyDigest: false,
    firmwareUpdates: true,
  })

  return (
    <SettingsSection title="Notifications" description="Delivered to your account email.">
      <Switch
        label="Device goes offline"
        description="Alerts as soon as a device misses two check-ins."
        checked={prefs.deviceOffline}
        onCheckedChange={(checked) => setPrefs({ ...prefs, deviceOffline: checked === true })}
      />
      <Switch
        label="Firmware updates"
        description="A summary when a new firmware release is available."
        checked={prefs.firmwareUpdates}
        onCheckedChange={(checked) => setPrefs({ ...prefs, firmwareUpdates: checked === true })}
      />
      <Switch
        label="Weekly digest"
        description="Fleet health and throughput, every Monday."
        checked={prefs.weeklyDigest}
        onCheckedChange={(checked) => setPrefs({ ...prefs, weeklyDigest: checked === true })}
      />
    </SettingsSection>
  )
}
