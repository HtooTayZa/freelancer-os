import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Freelancer OS</CardTitle>
          <CardDescription>Enter your email below to login or create an account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="auth-form" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="hello@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            {resolvedSearchParams?.error && (
              <p className="text-sm text-red-500 font-medium">{resolvedSearchParams.error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button form="auth-form" formAction={login} className="w-full">Log In</Button>
          <Button form="auth-form" formAction={signup} variant="outline" className="w-full">Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  )
}