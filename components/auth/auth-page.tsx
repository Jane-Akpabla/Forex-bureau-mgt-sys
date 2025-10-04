"use client"

import { LoginForm } from './login-form'

export function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold">ForexHub</h1>
          <p className="text-muted-foreground">
            Professional forex bureau management system
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  )
}
