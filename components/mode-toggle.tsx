"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icon"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Input } from "./ui/input"
import { motion } from "framer-motion"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const variants = {
    system: { x: 0 },
    dark: { x: '33%' },
    light: { x: '66%' },
  }

  return (
    <RadioGroup defaultValue={theme} className="flex p-1 h-9 rounded-full bg-accent border border-input theme-switcher relative overflow-hidden">
      <div className="h-full">
        <Input type="radio" name="theme" value="system" id="r1" className="hidden" checked={theme == 'system'} onChange={() => setTheme('system')} />
        <Label htmlFor="r1" className="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"><Icons.laptop className="h-4 w-4" /></Label>
      </div>
      <div className="h-full">
        <Input type="radio" name="theme" value="dark" id="r2" className="hidden" checked={theme == 'dark'} onChange={() => setTheme('dark')} />
        <Label htmlFor="r2" className="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"><Icons.moon className="h-4 w-4" /></Label>
      </div>
      <div className="h-full">
        <Input type="radio" name="theme" id="r3" className="hidden" checked={theme == 'light'} onChange={() => setTheme('light')} />
        <Label htmlFor="r3" className="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"><Icons.sun className="h-4 w-4" /></Label>
      </div>
    </RadioGroup>
  )
}