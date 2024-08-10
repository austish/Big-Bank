'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setAlertVisible(false);

        try {
            if (type === 'sign-up') {
                // The optional params are optional when signing in
                // But when signing up, we know that all of the params will be given 
                const userData = {
                    email: data.email,
                    password: data.password!,
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                }

                const newUser = await signUp(userData);
                setUser(newUser);
            }
            else if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password!
                })
                // if signed in, send to home page
                if (response) {
                    router.push('/')
                } else {
                    // wrong password/email
                    setAlertVisible(true);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setAlertVisible(false);
        }
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-8 md:gap-8'>
                <Link href="/" className="cursor-pointer items-center flex gap-1">
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="logo"
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Big Bank</h1>
                </Link>
                {/* md = medium devices */}
                <div className='flex flex-col gap-1 md:gap-3'>
                    {/* lg = large devices */}
                    <h1 className='text-24 lg:text-36 font-semibold'>
                        {user
                            // if user then 'Link Account'
                            ? 'Link Account'
                            // else if type == 'sign in'
                            : type === 'sign-in'
                                // then 'sign in'
                                ? 'Sign In'
                                // else 'sign up'
                                : 'Sign Up'
                        }
                        <p className='text-16 font-normal text-gray-600'>
                            {user
                                ? 'Link your account to get started'
                                : 'Please enter your details'
                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    <PlaidLink user={user} variant='primary' />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        {/* on submit handler */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className='flex gap-4'>
                                        <CustomInput control={form.control} name='firstName' label='First Name' placeholder={'ex: John'} />
                                        <CustomInput control={form.control} name='lastName' label='Last Name' placeholder={'ex: Doe'} />
                                    </div>
                                </>
                            )}
                            <CustomInput control={form.control} name='email' label='Email' placeholder={'Enter your email'} />
                            <CustomInput control={form.control} name='password' label='Password' placeholder={'Enter your password'} />
                            {alertVisible && (
                                <Alert variant="failure">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>Incorrect email or password.</AlertDescription>
                                </Alert>
                            )}
                            <div className='flex flex-col gap-4'>
                                <Button type="submit" className='form-btn' disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' /> &nbsp;
                                            Loading...
                                        </>
                                    ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'sign-in'
                                ? "Don't have an account? "
                                : "Already have an account? "
                            }
                            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                                {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                            </Link>
                        </p>
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm