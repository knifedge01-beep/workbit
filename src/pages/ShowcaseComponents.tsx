import styled from 'styled-components'
import {
  Navbar,
  ThemeToggle,
  Breadcrumb,
  Tabs,
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  IconButton,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  Switch,
  Badge,
  Avatar,
  Divider,
  Alert,
  Banner,
  Skeleton,
  Tooltip,
  Modal,
  Calendar,
  DatePicker,
  TimePicker,
  Flex,
  Grid,
  Sidebar,
  SidebarSection,
  SidebarSectionHeading,
  SidebarNavItem,
  Dropdown,
  TableHeader,
  StarRating,
  Tags,
  Notification,
  Accordion,
  Selector,
  Slider,
  AdvancedToggle,
  Pagination,
  Steps,
} from '@design-system'
import { useState } from 'react'
import { Heart, User, BarChart3 } from 'lucide-react'

const SidebarLayout = styled.div`
  display: flex;
  min-height: 280px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
`

const NavLink = styled.a`
  display: block;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  color: ${(p) => p.theme.colors.text};
  text-decoration: none;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    background: ${(p) => p.theme.colors.background};
  }
`

const MainContent = styled.main`
  flex: 1;
  padding: ${(p) => p.theme.spacing[4]}px;
  background: ${(p) => p.theme.colors.background};
`

const BrandText = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
`

function SidebarDemo() {
  return (
    <SidebarLayout>
      <Sidebar
        header={<BrandText>Workbit</BrandText>}
        footer={
          <Text size="sm" muted>v1.0.0</Text>
        }
      >
        <Stack gap={0}>
          <NavLink href="#">Dashboard</NavLink>
          <NavLink href="#">Projects</NavLink>
          <NavLink href="#">Team</NavLink>
          <NavLink href="#">Settings</NavLink>
        </Stack>
      </Sidebar>
      <MainContent>
        <Text muted>Main content area. Sidebar supports header, nav links, and footer.</Text>
      </MainContent>
    </SidebarLayout>
  )
}

const Page = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
`

const SECTION_TABS = [
  { id: 'ui', label: 'UI' },
  { id: 'typography', label: 'Typography' },
  { id: 'layout', label: 'Layout' },
  { id: 'nav', label: 'Navigation' },
  { id: 'datetime', label: 'Date & Time' },
] as const

export function ShowcaseComponents() {
  const [activeTab, setActiveTab] = useState('ui')
  const [modalOpen, setModalOpen] = useState(false)
  const [checkboxVal, setCheckboxVal] = useState(false)
  const [switchVal, setSwitchVal] = useState(false)
  const [selectVal, setSelectVal] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<{ hours: number; minutes: number } | undefined>(undefined)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <Page>
      <Navbar
        left={
          <Breadcrumb
            items={[
              { label: 'Workbit', href: '#' },
              { label: 'Design System', href: '#' },
              { label: 'Showcase' },
            ]}
          />
        }
        right={<ThemeToggle />}
      />

      <Container>
        <Stack gap={4}>
          <Heading level={1}>Showcase Components</Heading>
          <Text muted>Design system components built with styled-components and theme tokens.</Text>

          <Tabs
            tabs={SECTION_TABS.map((t) => ({ id: t.id, label: t.label }))}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'ui' && (
            <Stack gap={4}>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Buttons</Heading>
                  <Flex gap={2} wrap>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="primary" size="sm">Small</Button>
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>IconButton</Heading>
                  <Flex gap={2}>
                    <Tooltip title="Like">
                      <IconButton aria-label="Like">
                        <Heart size={18} />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Tooltip</Heading>
                  <Text size="sm" muted>Light / Dark and positions</Text>
                  <Flex gap={3} wrap>
                    <Tooltip title="Tooltip text goes here" position="top" variant="light"><Button size="sm">Top</Button></Tooltip>
                    <Tooltip title="Tooltip text goes here" position="bottom" variant="light"><Button size="sm">Bottom</Button></Tooltip>
                    <Tooltip title="Tooltip text goes here" position="left" variant="dark"><Button size="sm">Left</Button></Tooltip>
                    <Tooltip title="Tooltip text goes here" position="right" variant="dark"><Button size="sm">Right</Button></Tooltip>
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Input & Label</Heading>
                  <Label htmlFor="demo-input">Name</Label>
                  <Input id="demo-input" placeholder="Enter name" />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Textarea</Heading>
                  <Textarea placeholder="Message" rows={3} />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Checkbox & Switch</Heading>
                  <Checkbox label="Accept terms" checked={checkboxVal} onChange={setCheckboxVal} />
                  <Switch label="Enable" checked={switchVal} onChange={setSwitchVal} />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Select</Heading>
                  <Select
                    placeholder="Choose..."
                    options={[
                      { value: 'a', label: 'Option A' },
                      { value: 'b', label: 'Option B' },
                    ]}
                    value={selectVal}
                    onChange={setSelectVal}
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Badge Light</Heading>
                  <Text size="sm" muted>Medium</Text>
                  <Flex gap={2} wrap>
                    {(['blue', 'grey', 'green', 'red', 'orange'] as const).map((c) => (
                      <Badge key={c} variant="light" color={c}>Badge</Badge>
                    ))}
                  </Flex>
                  <Text size="sm" muted>Small</Text>
                  <Flex gap={2} wrap>
                    {(['blue', 'grey', 'green', 'red', 'orange'] as const).map((c) => (
                      <Badge key={c} variant="light" size="small" color={c}>Badge</Badge>
                    ))}
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Badge Solid</Heading>
                  <Text size="sm" muted>Medium</Text>
                  <Flex gap={2} wrap>
                    {(['blue', 'grey', 'green', 'red', 'orange'] as const).map((c) => (
                      <Badge key={c} variant="solid" color={c}>Badge</Badge>
                    ))}
                  </Flex>
                  <Text size="sm" muted>Small</Text>
                  <Flex gap={2} wrap>
                    {(['blue', 'grey', 'green', 'red', 'orange'] as const).map((c) => (
                      <Badge key={c} variant="solid" size="small" color={c}>Badge</Badge>
                    ))}
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Badge & Avatar</Heading>
                  <Flex gap={2} align="center">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Avatar name="Jane Doe" size={32} />
                    <Avatar name="AB" size={40} />
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Alert</Heading>
                  <Alert variant="info">Info message</Alert>
                  <Alert variant="success">Success message</Alert>
                  <Alert variant="warning">Warning message</Alert>
                  <Alert variant="error">Error message</Alert>
                </Stack>
              </Card>
              {!bannerDismissed && (
                <Banner variant="info" onDismiss={() => setBannerDismissed(true)}>
                  This is a dismissible banner.
                </Banner>
              )}
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Skeleton</Heading>
                  <Skeleton width="60%" height="1rem" />
                  <Skeleton width="40%" height="1rem" />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Modal</Heading>
                  <Button onClick={() => setModalOpen(true)}>Open modal</Button>
                  <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Demo Modal">
                    <Text>Modal content here.</Text>
                  </Modal>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Dropdown states</Heading>
                  <Flex gap={2} wrap>
                    <Dropdown options={[{ value: 'a', label: 'List Item Name' }]} placeholder="Dropdown text" state="default" />
                    <Dropdown options={[{ value: 'a', label: 'List Item Name' }]} placeholder="Dropdown text" state="error" />
                    <Dropdown options={[{ value: 'a', label: 'List Item Name' }]} placeholder="Dropdown text" state="success" />
                    <Dropdown options={[{ value: 'a', label: 'List Item Name' }]} placeholder="Dropdown text" state="disabled" disabled />
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Table Header</Heading>
                  <Text size="sm" muted>Light Header</Text>
                  <TableHeader columns={['Column Name', 'Column One', 'Column Two', 'Column Three']} variant="light" />
                  <Text size="sm" muted>Solid Header</Text>
                  <TableHeader columns={['Column Name', 'Column One', 'Column Two', 'Column Three']} variant="solid" />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Star Rating</Heading>
                  <Flex gap={3} align="center">
                    <Stack gap={0}>
                      <Text size="xs" muted>Full Stars</Text>
                      <StarRating value={5} readOnly />
                    </Stack>
                    <Stack gap={0}>
                      <Text size="xs" muted>Half Star</Text>
                      <StarRating value={4.5} readOnly />
                    </Stack>
                    <Stack gap={0}>
                      <Text size="xs" muted>Empty Star</Text>
                      <StarRating value={4} readOnly />
                    </Stack>
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Tags</Heading>
                  <Flex gap={2} align="center" wrap>
                    <Tags label="Tag Name" onDismiss={() => {}} size="large" />
                    <Tags label="Tag Name" onDismiss={() => {}} size="medium" />
                    <Tags label="Tag Name" onDismiss={() => {}} size="small" />
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Floating Notification</Heading>
                  <Text size="sm" muted>Solid</Text>
                  <Stack gap={1}>
                    <Notification variant="solid" type="primary" onDismiss={() => {}}>Primary notification example</Notification>
                    <Notification variant="solid" type="success" onDismiss={() => {}}>Success notification example</Notification>
                    <Notification variant="solid" type="error" onDismiss={() => {}}>Error notification example</Notification>
                  </Stack>
                  <Text size="sm" muted>Light</Text>
                  <Stack gap={1}>
                    <Notification variant="light" type="primary" onDismiss={() => {}}>Primary notification example</Notification>
                  </Stack>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Accordion</Heading>
                  <Accordion
                    size="medium"
                    singleOpen
                    items={[
                      { id: '1', label: 'Accordion item name', content: 'Opened accordion component content goes here. Only one accordion item can be opened at once.' },
                      { id: '2', label: 'Accordion item name', content: 'Second item content.' },
                    ]}
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Selector</Heading>
                  <Selector
                    options={[{ id: 'l', label: 'Large' }, { id: 'm', label: 'Medium' }, { id: 's', label: 'Small' }]}
                    value="m"
                    onChange={() => {}}
                    size="medium"
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Slider</Heading>
                  <Slider defaultValue={50} onChange={() => {}} />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Advanced Toggle</Heading>
                  <AdvancedToggle
                    options={[{ id: '1', label: 'Toggle Name' }, { id: '2', label: 'Toggle Name' }, { id: '3', label: 'Toggle Name' }]}
                    value="2"
                    onChange={() => {}}
                    size="medium"
                  />
                </Stack>
              </Card>
            </Stack>
          )}

          {activeTab === 'typography' && (
            <Stack gap={4}>
              <Card>
                <Stack gap={2}>
                  <Heading level={1}>Heading 1</Heading>
                  <Heading level={2}>Heading 2</Heading>
                  <Heading level={3}>Heading 3</Heading>
                  <Text>Body text.</Text>
                  <Text size="sm" muted>Small muted text.</Text>
                </Stack>
              </Card>
            </Stack>
          )}

          {activeTab === 'layout' && (
            <Stack gap={4}>
              <Card>
                <Heading level={3}>Flex</Heading>
                <Flex gap={3} align="center">
                  <div>Item 1</div>
                  <div>Item 2</div>
                  <div>Item 3</div>
                </Flex>
              </Card>
              <Card>
                <Heading level={3}>Grid</Heading>
                <Grid columns={3} gap={2}>
                  <Card>1</Card>
                  <Card>2</Card>
                  <Card>3</Card>
                </Grid>
              </Card>
              <Card>
                <Heading level={3}>Divider</Heading>
                <Text>Above</Text>
                <Divider />
                <Text>Below</Text>
              </Card>
            </Stack>
          )}

          {activeTab === 'nav' && (
            <Stack gap={4}>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Navbar</Heading>
                  <Text size="sm" muted>Light</Text>
                  <Navbar
                    variant="light"
                    left={<><BrandText>Workbit</BrandText><Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }]} /></>}
                    right={<><ThemeToggle /><Button variant="ghost" size="sm">Sign in</Button><Button variant="primary" size="sm">Get started</Button></>}
                  />
                  <Text size="sm" muted>Dark</Text>
                  <Navbar
                    variant="dark"
                    left={<><BrandText>Workbit</BrandText><Breadcrumb items={[{ label: 'Home', href: '#' }]} /></>}
                    right={<ThemeToggle />}
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Tabs Horizontal</Heading>
                  <Tabs tabs={[{ id: '1', label: 'First Tab' }, { id: '2', label: 'Second Tab' }]} activeId="1" onChange={() => {}} />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Tabs Vertical & Icon Tabs</Heading>
                  <Flex gap={4}>
                    <Tabs orientation="vertical" tabs={[{ id: '1', label: 'First Tab' }, { id: '2', label: 'Second Tab' }]} activeId="1" onChange={() => {}} />
                    <Tabs
                      tabs={[
                        { id: '1', label: 'First Tab', icon: <User size={16} /> },
                        { id: '2', label: 'Second Tab', icon: <BarChart3 size={16} /> },
                      ]}
                      activeId="1"
                      onChange={() => {}}
                    />
                  </Flex>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Sidebar with sections</Heading>
                  <SidebarLayout>
                    <Sidebar header={<BrandText>Light Navigation</BrandText>}>
                      <SidebarSection>
                        <SidebarNavItem href="#" $active>Orders</SidebarNavItem>
                        <SidebarNavItem href="#">Dashboard</SidebarNavItem>
                        <SidebarNavItem href="#">Products</SidebarNavItem>
                      </SidebarSection>
                      <SidebarSection>
                        <SidebarSectionHeading>Other Information</SidebarSectionHeading>
                        <SidebarNavItem href="#">Knowledge Base</SidebarNavItem>
                      </SidebarSection>
                      <SidebarSection>
                        <SidebarSectionHeading>Settings</SidebarSectionHeading>
                        <SidebarNavItem href="#">Personal Settings</SidebarNavItem>
                      </SidebarSection>
                    </Sidebar>
                    <MainContent><Text muted>Main content.</Text></MainContent>
                  </SidebarLayout>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Sidebar (simple)</Heading>
                  <SidebarDemo />
                </Stack>
              </Card>
              <Card>
                <Heading level={3}>Breadcrumb</Heading>
                <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Current' }]} />
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Pagination</Heading>
                  <Pagination page={1} totalPages={4} onPageChange={() => {}} />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Steps</Heading>
                  <Steps
                    orientation="horizontal"
                    steps={[
                      { id: '1', label: 'First Step', status: 'completed' },
                      { id: '2', label: 'Second Step', status: 'completed' },
                      { id: '3', label: 'Third Step', status: 'active' },
                      { id: '4', label: 'Fourth Step', status: 'upcoming' },
                    ]}
                  />
                </Stack>
              </Card>
            </Stack>
          )}

          {activeTab === 'datetime' && (
            <Stack gap={4}>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>Calendar</Heading>
                  <Calendar value={date} onChange={setDate} />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>DatePicker</Heading>
                  <DatePicker value={date} onChange={setDate} />
                  <Text size="sm" muted>With custom placeholder (e.g. target date):</Text>
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    placeholder="Select target date"
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Heading level={3}>TimePicker</Heading>
                  <TimePicker value={time} onChange={setTime} />
                </Stack>
              </Card>
            </Stack>
          )}
        </Stack>
      </Container>
    </Page>
  )
}
