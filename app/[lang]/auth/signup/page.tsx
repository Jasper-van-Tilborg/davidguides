import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../../../translations'
import SignUpForm from '@/components/auth/SignUpForm'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: `${t.auth.signUp} - ${t.common.appName}`,
    description: 'Create a new Habit Adventure account',
  }
}

export default async function SignUpPage({ params }: Props) {
  return <SignUpForm />
}





