import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { Button } from '@base-ui/react/button'
import { Dialog } from '@base-ui/react/dialog'
import { Select } from '@base-ui/react/select'
import { Slider } from '@base-ui/react/slider'
import { Switch } from '@base-ui/react/switch'
import { createBrowserRouter, isRouteErrorResponse, Outlet, useRouteError } from 'react-router'

import { TodosPage } from './pages/todos'

import styles from './app.module.less'

const accentOptions = [
  { label: 'Cedar', value: 'cedar', color: '#1d7562', soft: '#e4f3ef' },
  { label: 'Blue', value: 'blue', color: '#2563eb', soft: '#e7efff' },
  { label: 'Rose', value: 'rose', color: '#be3455', soft: '#fde8ee' },
] as const

const surfaceOptions = [
  {
    label: 'Clear',
    value: 'clear',
    page: '#f5f7fb',
    surface: '#fff',
    text: '#1b2230',
    muted: '#626d7f',
    border: '#d5dce8',
    strongBorder: '#aeb9ca',
  },
  {
    label: 'Mist',
    value: 'mist',
    page: '#eef6f4',
    surface: '#fbfffe',
    text: '#15241f',
    muted: '#61706b',
    border: '#ccdbd7',
    strongBorder: '#9db3ad',
  },
  {
    label: 'Paper',
    value: 'paper',
    page: '#f8f6f1',
    surface: '#fffdf8',
    text: '#24211a',
    muted: '#706a5c',
    border: '#ddd7ca',
    strongBorder: '#bdb29f',
  },
] as const

type Accent = (typeof accentOptions)[number]['value']
type Surface = (typeof surfaceOptions)[number]['value']

interface AppThemeStyle extends CSSProperties {
  '--app-accent': string
  '--app-accent-soft': string
  '--app-page': string
  '--app-surface': string
  '--app-text': string
  '--app-muted': string
  '--app-border': string
  '--app-radius': string
  '--app-control-height': string
  '--app-list-gap': string
  '--app-panel-padding': string
}

interface ThemeSelectOption {
  label: string
  value: string
  color?: string
}

interface ThemeSelectProps {
  label: string
  options: ReadonlyArray<ThemeSelectOption>
  value: string
  onValueChange: (value: string) => void
}

const ThemeSelect = ({ label, options, value, onValueChange }: ThemeSelectProps) => (
  <Select.Root
    modal={false}
    value={value}
    onValueChange={(nextValue) => {
      if (nextValue) {
        onValueChange(nextValue)
      }
    }}
  >
    <div className={styles.themeField}>
      <Select.Label className={styles.themeFieldLabel}>{label}</Select.Label>
      <Select.Trigger className={styles.themeSelect}>
        <Select.Value />
        <Select.Icon className={styles.themeSelectIcon}>
          <span className={styles.themeSelectChevron} />
        </Select.Icon>
      </Select.Trigger>
    </div>
    <Select.Portal>
      <Select.Positioner className={styles.themeSelectPositioner} sideOffset={8}>
        <Select.Popup className={styles.themeSelectPopup}>
          <Select.List>
            {options.map((option) => (
              <Select.Item className={styles.themeSelectItem} key={option.value} value={option.value}>
                {option.color ? (
                  <span className={styles.themeSwatch} style={{ '--theme-swatch': option.color } as CSSProperties} />
                ) : (
                  <span className={styles.themeSwatchEmpty} />
                )}
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.themeSelectIndicator}>
                  <span className={styles.themeSelectCheck} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
)

const AppLayout = () => {
  const [accent, setAccent] = useState<Accent>('cedar')
  const [surface, setSurface] = useState<Surface>('clear')
  const [radius, setRadius] = useState(8)
  const [compact, setCompact] = useState(false)
  const [strongBorders, setStrongBorders] = useState(false)
  const activeAccent = accentOptions.find((option) => option.value === accent) ?? accentOptions[0]
  const activeSurface = surfaceOptions.find((option) => option.value === surface) ?? surfaceOptions[0]
  const themeStyle = useMemo<AppThemeStyle>(
    () => ({
      '--app-accent': activeAccent.color,
      '--app-accent-soft': activeAccent.soft,
      '--app-page': activeSurface.page,
      '--app-surface': activeSurface.surface,
      '--app-text': activeSurface.text,
      '--app-muted': activeSurface.muted,
      '--app-border': strongBorders ? activeSurface.strongBorder : activeSurface.border,
      '--app-radius': `${radius}px`,
      '--app-control-height': compact ? '36px' : '42px',
      '--app-list-gap': compact ? '8px' : '12px',
      '--app-panel-padding': compact ? '14px' : '18px',
    }),
    [activeAccent.color, activeAccent.soft, activeSurface, compact, radius, strongBorders],
  )

  useEffect(() => {
    const entries = Object.entries(themeStyle) as Array<[keyof AppThemeStyle, string]>
    entries.forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value)
    })

    return () => {
      entries.forEach(([property]) => {
        document.documentElement.style.removeProperty(property)
      })
    }
  }, [themeStyle])

  return (
    <main className={styles.shell} style={themeStyle}>
      <div className={styles.layout}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div className={styles.brand}>
              <strong>Todo Starter</strong>
              <span>React, Hono, Drizzle, and SQLite.</span>
            </div>
            <Dialog.Root>
              <Dialog.Trigger className={styles.themeTrigger}>Theme</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop className={styles.dialogBackdrop} />
                <Dialog.Viewport className={styles.dialogViewport}>
                  <Dialog.Popup className={styles.dialogPopup}>
                    <div className={styles.dialogHeader}>
                      <div>
                        <Dialog.Title className={styles.dialogTitle}>Theme</Dialog.Title>
                        <Dialog.Description className={styles.dialogDescription}>
                          Adjust the app tokens for this starter.
                        </Dialog.Description>
                      </div>
                      <Dialog.Close className={styles.iconButton} aria-label="Close theme settings">
                        <span className={styles.closeIcon} />
                      </Dialog.Close>
                    </div>

                    <div className={styles.themeGrid}>
                      <ThemeSelect
                        label="Accent"
                        options={accentOptions}
                        value={accent}
                        onValueChange={(nextAccent) => {
                          setAccent(nextAccent as Accent)
                        }}
                      />
                      <ThemeSelect
                        label="Surface"
                        options={surfaceOptions}
                        value={surface}
                        onValueChange={(nextSurface) => {
                          setSurface(nextSurface as Surface)
                        }}
                      />

                      <Slider.Root
                        className={styles.sliderRoot}
                        max={8}
                        min={4}
                        step={1}
                        value={radius}
                        onValueChange={(nextRadius) => {
                          setRadius(nextRadius)
                        }}
                      >
                        <div className={styles.sliderHeader}>
                          <Slider.Label className={styles.themeFieldLabel}>Radius</Slider.Label>
                          <Slider.Value className={styles.sliderValue} />
                        </div>
                        <Slider.Control className={styles.sliderControl}>
                          <Slider.Track className={styles.sliderTrack}>
                            <Slider.Indicator className={styles.sliderIndicator} />
                          </Slider.Track>
                          <Slider.Thumb className={styles.sliderThumb} />
                        </Slider.Control>
                      </Slider.Root>

                      <div className={styles.switchRow}>
                        <span>
                          <span className={styles.themeFieldLabel}>Compact</span>
                          <span className={styles.switchHint}>Tighter controls and list spacing</span>
                        </span>
                        <Switch.Root
                          aria-label="Compact density"
                          checked={compact}
                          className={styles.switchRoot}
                          onCheckedChange={(checked) => {
                            setCompact(checked)
                          }}
                        >
                          <Switch.Thumb className={styles.switchThumb} />
                        </Switch.Root>
                      </div>

                      <div className={styles.switchRow}>
                        <span>
                          <span className={styles.themeFieldLabel}>Borders</span>
                          <span className={styles.switchHint}>Stronger structure across panels</span>
                        </span>
                        <Switch.Root
                          aria-label="Strong borders"
                          checked={strongBorders}
                          className={styles.switchRoot}
                          onCheckedChange={(checked) => {
                            setStrongBorders(checked)
                          }}
                        >
                          <Switch.Thumb className={styles.switchThumb} />
                        </Switch.Root>
                      </div>
                    </div>

                    <div className={styles.dialogActions}>
                      <Button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => {
                          setAccent('cedar')
                          setSurface('clear')
                          setRadius(8)
                          setCompact(false)
                          setStrongBorders(false)
                        }}
                      >
                        Reset
                      </Button>
                      <Dialog.Close className={styles.primaryButton}>Done</Dialog.Close>
                    </div>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </main>
  )
}

const RouteErrorPage = () => {
  const error = useRouteError()
  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Unexpected route error'
  const detail = isRouteErrorResponse(error) ? error.data : 'The route threw an unknown error.'

  return (
    <main className={styles.shell}>
      <section className={styles.content}>
        <div className={styles.errorPanel}>
          <h1>{title}</h1>
          <p>{detail}</p>
        </div>
      </section>
    </main>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <TodosPage />,
      },
    ],
  },
])
