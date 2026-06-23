// src/components/LoginApp.tsx
// HU-2: Registro / login con magic link o Google OAuth
// HU-9: Recuperar acceso (magic link re-envío)
// Solo mock — no envía emails ni valida credenciales.

import { useState } from 'react';

type Step = 'enter-email' | 'sent-magic' | 'recover-sent' | 'logged-in';

export default function LoginApp() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('enter-email');

  function handleSendMagic(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStep('sent-magic');
  }

  function handleGoogle() {
    setStep('logged-in');
  }

  if (step === 'logged-in') {
    return (
      <div class="min-h-[60vh] flex items-center justify-center px-6">
        <div class="text-center max-w-sm">
          <div class="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F3829" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">Bienvenido</h1>
          <p class="text-sm text-charcoal/60 mb-8">Sesión iniciada como <span class="text-navy">{email}</span></p>
          <a href="/cuenta" class="inline-block px-6 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200">
            Ir a mi cuenta
          </a>
        </div>
      </div>
    );
  }

  if (step === 'sent-magic' || step === 'recover-sent') {
    return (
      <div class="min-h-[60vh] flex items-center justify-center px-6">
        <div class="max-w-md w-full text-center">
          <div class="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F3829" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 class="font-serif text-2xl font-bold text-charcoal mb-3">Revisa tu bandeja</h1>
          <p class="text-sm text-charcoal/60 mb-1">
            {step === 'sent-magic'
              ? 'Te enviamos un link mágico para entrar a tu cuenta.'
              : 'Te enviamos un nuevo link para recuperar tu acceso.'}
          </p>
          <p class="text-sm text-navy font-medium mb-8">{email}</p>
          <p class="text-xs text-charcoal/40 mb-6">El link expira en 15 minutos. Si no llega, revisa spam.</p>

          <div class="border-t border-sand/30 pt-6 space-y-3">
            <p class="text-xs text-charcoal/50">¿No te llegó?</p>
            <button
              onClick={() => setStep('recover-sent')}
              class="text-xs text-navy underline underline-offset-2 hover:text-coffee transition-colors cursor-pointer"
            >
              Enviar otro link
            </button>
            <span class="text-charcoal/30 mx-2">·</span>
            <button
              onClick={() => setStep('enter-email')}
              class="text-xs text-charcoal/50 underline underline-offset-2 hover:text-navy transition-colors cursor-pointer"
            >
              Cambiar email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div class="max-w-md w-full">
        <div class="text-center mb-10">
          <a href="/" class="font-serif text-2xl font-bold text-charcoal tracking-[-0.03em]">icónico</a>
          <h1 class="font-serif text-3xl font-bold text-charcoal mt-6 mb-2">Entra a tu cuenta</h1>
          <p class="text-sm text-charcoal/60">Te enviamos un link a tu email, sin contraseñas.</p>
        </div>

        <form onSubmit={handleSendMagic} class="space-y-4">
          <div>
            <label htmlFor="email" class="block text-xs font-medium text-charcoal/70 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal placeholder:text-charcoal/30 focus:border-navy focus:outline-none transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            class="w-full px-4 py-3.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            Enviar link mágico
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-sand/40" />
          </div>
          <div class="relative flex justify-center">
            <span class="px-3 bg-cream text-[0.625rem] tracking-[0.3em] uppercase text-charcoal/40">o</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          class="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-full border border-sand/40 hover:border-navy/30 transition-colors duration-200 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span class="text-sm font-medium text-charcoal">Continuar con Google</span>
        </button>

        <p class="mt-8 text-center text-xs text-charcoal/40">
          Al continuar aceptas los términos de servicio y la política de privacidad.
        </p>
      </div>
    </div>
  );
}
