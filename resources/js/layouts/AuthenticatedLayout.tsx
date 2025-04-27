import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

export default function Authenticated({ user, header, children } : any) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1 className="text-2xl font-semibold text-gray-900">نظام الموارد البشرية</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:mr-10 sm:flex">
                                <Link
                                    href={route('employees.index')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('employees.*')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    الموظفين
                                </Link>
                                <Link
                                    href={route('employee-notes.index')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('dashboard')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                   بطاقات التنقيط
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('dashboard')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                 
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('dashboard')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    لوحة التحكم
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('dashboard')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    لوحة التحكم
                                </Link>
                                <Link
                                    href={route('promotions.index')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('promotions.*')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    الترقيات المحتملة
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('dashboard')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    لوحة التحكم
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                                        route().current('dashboard')
                                            ? 'border-indigo-400 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    لوحة التحكم
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:mr-6">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center">
                                        {user.name}
                                        <svg
                                            className="mr-2 -ml-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={route('profile.edit')} className="w-full">
                                            الملف الشخصي
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('logout')} method="post" as="button" className="w-full">
                                            تسجيل الخروج
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="-ml-2 flex items-center sm:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href={route('dashboard')}
                            className={cn(
                                'block w-full pr-3 pl-4 py-2 border-l-4 text-right text-base font-medium transition duration-150 ease-in-out',
                                route().current('dashboard')
                                    ? 'border-indigo-400 text-indigo-700 bg-indigo-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            )}
                        >
                            لوحة التحكم
                        </Link>
                        <Link
                            href={route('employees.index')}
                            className={cn(
                                'block w-full pr-3 pl-4 py-2 border-l-4 text-right text-base font-medium transition duration-150 ease-in-out',
                                route().current('employees.*')
                                    ? 'border-indigo-400 text-indigo-700 bg-indigo-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            )}
                        >
                            الموظفين
                        </Link>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link
                                href={route('profile.edit')}
                                className="block w-full pr-3 pl-4 py-2 border-l-4 border-transparent text-right text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                            >
                                الملف الشخصي
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full pr-3 pl-4 py-2 border-l-4 border-transparent text-right text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                            >
                                تسجيل الخروج
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}