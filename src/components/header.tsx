"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {Home, User, LogOut, PanelLeft} from 'lucide-react'
import {useSidebar} from "@/components/ui/sidebar";
import {logout} from "@/app/actions/auth";

export default function Header() {
  const { open, isMobile, toggleSidebar } = useSidebar();
  const showSideBarCollapseBtn = isMobile ? true : !open


  return (
    <header className="bg-white shadow-sm">
      <div className="m-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            { showSideBarCollapseBtn ? (
                <Button variant="secondary" size="icon" onClick={toggleSidebar}>
                  <PanelLeft />
                </Button>
            ) : null}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <Home className="h-5 w-5" />
                <span className="sr-only">Accueil</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
                <span className="sr-only">Mon profil</span>
              </Button>
            </Link>
            <form action={logout}>
              <Button variant="ghost" size="sm">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Déconnexion</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}

