'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut, auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);

    // console.log('Login attempt:', {
    //     formPassword: formData.get('password'),
    //     });
    const session = await auth(); // server-side session from setup
    const role = session?.user?.role;

    console.log('session.user.role: ', role);
    console.log('in actions->authenticate');

    const redirectTo = formData.get('redirectTo');
    if (
      redirectTo &&
      redirectTo !== 'null' &&
      redirectTo !== 'undefined' &&
      redirectTo !== '/login'
    ) {
      redirect(redirectTo as string);
    } else if (role === 'Admin') {
      redirect('/admin');
    } else if (role === 'Seller') {
      redirect('/dashboard');
    } else {
      redirect('/');
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid Username or Password';
        default:
          return 'Oops! Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
