import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../../../translations'
import SignInForm from '@/components/auth/SignInForm'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: `${t.auth.signIn} - ${t.common.appName}`,
    description: 'Sign in to your Habit Adventure account',
  }
}

export default async function SignInPage({ params }: Props) {
  return <SignInForm />
}

