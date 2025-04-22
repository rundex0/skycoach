"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupAction, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"
import {BookOpenCheck, Bot, HelpCircle, LayoutDashboard, LineChart, PanelLeft} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";


const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/quiz', label: 'Quiz', icon: HelpCircle },
    { href: '/revision', label: 'Révision', icon: BookOpenCheck },
    { href: '/progression', label: 'Progression', icon: LineChart },
    { href: '/coach', label: 'Coach IA', icon: Bot },
]

export function AppSidebar() {
    const { toggleSidebar, isMobile } = useSidebar()
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader />
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel></SidebarGroupLabel>
                        <SidebarGroupAction>
                            { isMobile ? null : (<PanelLeft onClick={toggleSidebar}/>)}
                        </SidebarGroupAction>
                        <SidebarMenu>
                            {links.map(({href, label, icon: Icon}) => (
                                <SidebarMenuItem key={label}>
                                    <SidebarMenuButton asChild isActive={pathname === href}>
                                        <Link
                                            key={href}
                                            href={href}
                                            className={cn(
                                                'flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition-colors'
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            <SidebarFooter />

        </Sidebar>
    )
}
