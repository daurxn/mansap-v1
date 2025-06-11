import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthPage from '../index.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormSubmitHandler = (values: Record<string, unknown>) => void | Promise<void>

// Mock app-container component
const AppContainer = {
  name: 'AppContainer',
  template: '<div><slot /></div>'
}

// Mock vee-validate
vi.mock('vee-validate', () => ({
  useForm: () => ({
    handleSubmit: (fn: FormSubmitHandler) => fn,
    values: {},
    setFieldValue: vi.fn(),
    resetForm: vi.fn()
  }),
  Field: {
    name: 'Field',
    render() {
      return null
    }
  }
}))

// Mock the i18n plugin
const mockI18n = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'auth.signup_title': 'Sign Up',
      'auth.signin_title': 'Sign In',
      'auth.signup_description': 'Create your account',
      'auth.name': 'Name',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.register': 'Register',
      'auth.login': 'Login'
    }
    return translations[key] || key
  }
}

// Mock the composables
vi.mock('~/composables/auth/useRegister', () => ({
  useRegister: () => ({
    onSubmit: vi.fn(),
    form: {
      handleSubmit: (fn: FormSubmitHandler) => fn,
      values: {},
      setFieldValue: vi.fn(),
      resetForm: vi.fn()
    }
  })
}))

vi.mock('~/composables/auth/useLogin', () => ({
  useLogin: () => ({
    onSubmit: vi.fn(),
    loggingIn: false,
    form: {
      handleSubmit: (fn: FormSubmitHandler) => fn,
      values: {},
      setFieldValue: vi.fn(),
      resetForm: vi.fn()
    }
  })
}))

// Mock the form components
const MockFormField = {
  name: 'FormField',
  props: ['name'],
  template: '<div><slot :componentField="{}" /></div>'
}

const MockFormItem = {
  name: 'FormItem',
  template: '<div><slot /></div>'
}

const MockFormLabel = {
  name: 'FormLabel',
  template: '<label><slot /></label>'
}

const MockFormControl = {
  name: 'FormControl',
  template: '<div><slot /></div>'
}

const MockFormMessage = {
  name: 'FormMessage',
  template: '<div><slot /></div>'
}

// Mock the form components
const MockSignupForm = {
  name: 'SignupForm',
  template: `
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('auth.signup_title') }}</CardTitle>
        <CardDescription>{{ $t('auth.signup_description') }}</CardDescription>
      </CardHeader>
      <form>
        <CardContent>
          <MockFormField name="name">
            <MockFormItem>
              <MockFormLabel>{{ $t('auth.name') }}</MockFormLabel>
              <MockFormControl>
                <Input type="text" />
              </MockFormControl>
            </MockFormItem>
          </MockFormField>
        </CardContent>
        <CardFooter>
          <Button type="submit">{{ $t('auth.register') }}</Button>
        </CardFooter>
      </form>
    </Card>
  `,
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    MockFormField,
    MockFormItem,
    MockFormLabel,
    MockFormControl,
    Input,
    Button
  }
}

const MockLoginForm = {
  name: 'LoginForm',
  template: `
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('auth.signin_title') }}</CardTitle>
      </CardHeader>
      <form>
        <CardContent>
          <MockFormField name="email">
            <MockFormItem>
              <MockFormLabel>{{ $t('auth.email') }}</MockFormLabel>
              <MockFormControl>
                <Input type="text" />
              </MockFormControl>
            </MockFormItem>
          </MockFormField>
        </CardContent>
        <CardFooter>
          <Button type="submit">{{ $t('auth.login') }}</Button>
        </CardFooter>
      </form>
    </Card>
  `,
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    MockFormField,
    MockFormItem,
    MockFormLabel,
    MockFormControl,
    Input,
    Button
  }
}

describe('AuthPage', () => {
  const createWrapper = () => {
    return mount(AuthPage, {
      global: {
        plugins: [],
        mocks: {
          $t: mockI18n.t
        },
        components: {
          AppContainer,
          Tabs,
          TabsContent,
          TabsList,
          TabsTrigger,
          SignupForm: MockSignupForm,
          LoginForm: MockLoginForm,
          Card,
          CardContent,
          CardFooter,
          CardHeader,
          CardTitle,
          CardDescription,
          FormField: MockFormField,
          FormItem: MockFormItem,
          FormLabel: MockFormLabel,
          FormControl: MockFormControl,
          FormMessage: MockFormMessage,
          Input,
          Button
        }
      }
    })
  }

  it('renders the component correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the main heading', () => {
    const wrapper = createWrapper()
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toContain('Нажмите на')
    expect(heading.text()).toContain('глобальная сеть талантов')
  })

  it('renders both feature sections', () => {
    const wrapper = createWrapper()
    const featureSections = wrapper.findAll('h5')
    expect(featureSections).toHaveLength(2)
    expect(featureSections[0].text()).toBe('Расместите свою работу')
    expect(featureSections[1].text()).toBe('Выбрать фрилансеров')
  })

  it('renders tabs with correct labels', () => {
    const wrapper = createWrapper()
    const tabTriggers = wrapper.findAllComponents(TabsTrigger)
    expect(tabTriggers).toHaveLength(2)
    expect(tabTriggers[0].text()).toBe('Sign Up')
    expect(tabTriggers[1].text()).toBe('Sign In')
  })
}) 