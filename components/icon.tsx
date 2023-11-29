import { cn } from "@/lib/utils";
type IconProps = React.HTMLAttributes<SVGElement>;

import {
     AlertTriangle,
     ArrowRight,
     Check,
     ChevronLeft,
     ChevronRight,
     Command,
     CreditCard,
     File,
     FileText,
     HelpCircle,
     Image,
     Laptop,
     Loader2,
     LucideProps,
     Moon,
     MoreVertical,
     Pizza,
     Plus,
     Settings,
     SunMedium,
     Trash,
     Twitter,
     User,
     X,
     type LucideIcon,
     Bookmark,
     Hash,
     SearchX,
     Cog,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
     close: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
     ),
     eye: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
     ),
     paperAirplane: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
</svg>
     ),
     spinner: Loader2,
     chevronLeft: ChevronLeft,
     chevronRight: ChevronRight,
     trash: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>

     ),
     post: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>

     ),
     page: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>),
     media: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
     ),
     settings: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
</svg>

     ),
     billing: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
</svg>

     ),
     ellipsis: MoreVertical,
     add: Plus,
     warning: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>
     ),
     user: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>
     ),
     arrowRight: ArrowRight,
     help: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
</svg>
     ),
     pizza: Pizza,
     sun: SunMedium,
     moon: Moon,
     laptop: Laptop,
     check: Check,
     hash: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
</svg>
     ),
     logOut: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
</svg>
     ),
     notfound: SearchX,
     notification: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
</svg>
     ),
     share: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
</svg>
     ),
     bookmark: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
</svg>

     ),
     like: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
</svg>
     ),
     commentBubble: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
</svg>
     ),
     moreHorizontal: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
</svg>
     ),
     link: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
</svg>
     ),
     users: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
</svg>
     ),
     location: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
</svg>
     ),
     envelope: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
</svg>
     ),
     calendarDays: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn("w-6 h-6", props.className)} {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
</svg>
     ),
     logoIcon: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466.45 466" {...props} fill="none" className={cn("h-5 w-auto ", props.className)}>
               <path d="M205.57,232.99H68.75L0,113.71h137.48l0.01,0.03L205.57,232.99z M205.57,232.99l-68.41,118.69L201.32,463 l68.74-119.26l63.83-110.73v-0.01H205.57z M201.32,3L137.5,113.71h265.13L466.45,3H201.32z" fill="currentColor" />
          </svg>
     ),
     noThumbnail: (props: IconProps) => (
          <svg className={cn("h-full bg-muted", props.className)} xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 189 112">
  <path d="M59.2,29.2L59.2,29.2l-58.7,0l29.3,50.9h58.4L59.2,29.2z M88.2,80.1L69.9,112h54.8L143,80.1v0H88.2z M76,0L59.2,29.2h113.2
	L189.2,0H76z" className="fill-muted-foreground/30 h-full"/>
</svg>
     ),
     search: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" {...props} className={cn("h-4 w-auto md:h-6", props.className)}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
     ),
     logo: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 689.11 100" {...props} fill="none" className={cn("h-4 w-auto md:h-6", props.className)}>
               <path d="M44.23,49.49H14.79L0,23.82h29.58l0,0.01L44.23,49.49z M44.23,49.49L29.51,75.03l13.81,23.95l14.79-25.66
	l13.73-23.83v0H44.23z M43.32,0L29.59,23.82h57.05L100.37,0H43.32z M129.86,94.11l1.08-0.9l-8.09-12.81l-1.26,0.53
	c-1.71,0.72-3.76,1.09-6.1,1.09c-10.12,0-13.38-7.1-14.42-11.33l-0.3-1.22H81.44l0.26,1.84c1.14,7.94,4.63,15.14,9.82,20.26
	c5.51,5.45,12.54,8.33,20.33,8.33C119.12,99.88,125.35,97.89,129.86,94.11z M152.81,72.67V32.92h-22.57v5.36
	c-4.7-4.72-11.6-7.27-19.91-7.27l-0.31,0c-10.82,0-20.84,5.93-26.13,15.48l-0.73,1.32l16.59,10.61l0.79-1.64
	c2.48-5.17,7.2-7.9,13.65-7.9c9.39,0,16.47,7.17,16.47,16.68c0,1.86-0.23,3.55-0.7,5.03l-0.65,2.09H152.81z M184.22,9.36v60.87
	h-19.68V9.36H184.22z M255.61,70.36c-1.22-3.05-3.27-5.52-6.15-7.44c-2.74-1.82-6.16-3.28-10.25-4.37h-13.74v15.01
	c3.49,0.5,6.14,1.05,7.94,1.65c2.58,0.86,3.87,2.19,3.87,4c0,1.81-0.9,3.24-2.71,4.3c-1.8,1.07-4.72,1.6-8.73,1.6
	c-0.12,0-0.25,0-0.37,0c-4.15-0.05-7.17-0.97-9.04-2.76c-1.93-1.84-2.93-4.2-3.01-7.07h-19.43c0.41,7.79,3.28,13.84,8.61,18.14
	c5.33,4.3,12.92,6.46,22.75,6.46h0.12c6.42-0.01,12-0.96,16.73-2.83c4.75-1.89,8.4-4.49,10.95-7.81c2.54-3.32,3.81-7.07,3.81-11.25
	C256.96,75.14,256.51,72.6,255.61,70.36z M217.97,47.24c1.56-0.98,4.02-1.47,7.38-1.47h0.12c6.48,0.03,9.84,2.66,10.09,7.87h19.43
	c-0.49-7.46-3.43-13.1-8.79-16.91c-5.37-3.81-12.2-5.72-20.48-5.72c-0.08,0-0.16,0-0.25,0c-6.13,0.02-11.42,1-15.87,2.94
	c-0.53,0.23-1.05,0.47-1.54,0.72l9.34,12.96C217.58,47.5,217.77,47.37,217.97,47.24z M309.82,76.48c-0.83,2.36-2.2,4.22-4.11,5.57
	c-1.97,1.4-4.43,2.09-7.38,2.09c-4.02,0-7.38-1.25-10.09-3.75c-2.71-2.5-4.39-5.84-5.04-10.03h-19.16
	c0.51,4.55,1.75,8.75,3.73,12.61c2.67,5.21,6.62,9.33,11.87,12.36c5.24,3.04,11.52,4.55,18.82,4.55c8.61,0,15.57-2.25,20.91-6.76
	c3.27-2.77,5.8-5.95,7.59-9.55L309.82,76.48z M326.13,45.46c-3.03-4.88-7.03-8.51-11.99-10.88c-4.96-2.38-10.31-3.57-16.05-3.57
	c-7.08,0-13.18,1.43-18.32,4.3l10.08,13.18c2.3-1.48,5.17-2.22,8.62-2.22c3.69,0,6.68,1.07,8.98,3.2c2.29,2.14,3.61,5.17,3.93,9.1
	h-14.15v11.81h33.08c0.25-1.89,0.37-4.18,0.37-6.89C330.68,56.34,329.16,50.34,326.13,45.46z M405.5,10.87v56.4
	c0,1.57,0.25,3.12,0.74,4.64c0.49,1.53,1.19,3.24,2.1,5.14c0.41,0.98,0.62,1.77,0.62,2.35c0,0.99-0.54,1.48-1.61,1.48
	c-0.74,0-1.36-0.49-1.85-1.48l-28.69-68.52h-31.66v59.36h20.78V41.54c0-1.56-0.25-3.11-0.74-4.64c-0.49-1.53-1.2-3.24-2.11-5.14
	c-0.41-0.98-0.61-1.73-0.61-2.23c0-0.82,0.49-1.36,1.48-1.6c0.74-0.08,1.4,0.42,1.98,1.48l28.69,68.52h31.66V10.87H405.5z
	 M499.25,47.85c-2.81-5.28-6.83-9.46-12.06-12.56c-5.24-3.09-11.36-4.64-18.36-4.64c-7.01,0-13.13,1.55-18.37,4.64
	c-1.34,0.79-2.59,1.65-3.77,2.57l11.47,14.34c2.57-3.15,6.13-4.73,10.66-4.73c4.7,0,8.35,1.69,10.94,5.07
	c2.6,3.38,3.9,7.63,3.9,12.73c0,1.84-0.17,3.58-0.52,5.19c-0.59,2.87-1.72,5.39-3.39,7.54c-2.59,3.39-6.24,5.07-10.94,5.07
	c-4.7,0-8.35-1.69-10.95-5.07c-1.66-2.16-2.79-4.67-3.38-7.54h-19.97c0.56,4.36,1.85,8.45,3.87,12.25
	c2.8,5.27,6.82,9.46,12.06,12.55c5.24,3.09,11.36,4.64,18.37,4.64c7,0,13.12-1.55,18.36-4.64c5.24-3.1,9.26-7.28,12.06-12.55
	c2.01-3.8,3.31-7.89,3.87-12.25c0.22-1.69,0.33-3.42,0.33-5.19C503.45,58.94,502.05,53.12,499.25,47.85z M514.33,48.47h-11.87V32.64
	h11.87V14.83h19.79v17.81h17.81v15.83h-17.81v21.77h-19.79V48.47z M601.02,76.59c-0.83,2.36-2.2,4.22-4.11,5.57
	c-1.97,1.4-4.43,2.09-7.38,2.09c-4.02,0-7.38-1.25-10.09-3.75c-2.71-2.5-4.39-5.84-5.04-10.03h-19.16
	c0.51,4.55,1.75,8.75,3.73,12.61c2.67,5.21,6.62,9.33,11.87,12.36c5.24,3.04,11.52,4.55,18.82,4.55c8.61,0,15.57-2.25,20.91-6.76
	c3.27-2.77,5.8-5.95,7.59-9.55L601.02,76.59z M617.33,45.58c-3.03-4.88-7.03-8.51-11.99-10.88c-4.96-2.38-10.31-3.57-16.05-3.57
	c-7.08,0-13.18,1.43-18.32,4.3l10.07,13.18c2.3-1.48,5.17-2.22,8.62-2.22c3.69,0,6.68,1.07,8.98,3.2c2.29,2.14,3.61,5.17,3.93,9.1
	h-14.15v11.81h33.08c0.25-1.89,0.37-4.18,0.37-6.89C621.88,56.46,620.37,50.45,617.33,45.58z M687.75,70.21
	c-1.22-3.05-3.27-5.52-6.15-7.44c-2.74-1.82-6.16-3.28-10.25-4.37h-13.74v15.01c3.49,0.5,6.14,1.05,7.94,1.65
	c2.58,0.86,3.87,2.19,3.87,4c0,1.81-0.9,3.24-2.71,4.3c-1.8,1.07-4.72,1.6-8.73,1.6c-0.12,0-0.25,0-0.37,0
	c-4.15-0.05-7.17-0.97-9.04-2.76c-1.93-1.84-2.93-4.2-3.01-7.07h-19.43c0.41,7.79,3.28,13.84,8.61,18.14
	c5.33,4.3,12.92,6.46,22.75,6.46h0.12c6.42-0.01,12-0.96,16.73-2.83c4.75-1.89,8.4-4.49,10.95-7.81c2.54-3.32,3.81-7.07,3.81-11.25
	C689.11,74.98,688.66,72.44,687.75,70.21z M650.12,47.08c1.56-0.98,4.02-1.47,7.38-1.47h0.12c6.48,0.03,9.84,2.66,10.09,7.87h19.43
	c-0.49-7.46-3.43-13.1-8.79-16.91c-5.37-3.81-12.2-5.72-20.48-5.72c-0.08,0-0.16,0-0.25,0c-6.13,0.02-11.42,1-15.87,2.94
	c-0.53,0.23-1.05,0.47-1.54,0.72l9.34,12.96C649.73,47.34,649.92,47.21,650.12,47.08z" fill="currentColor" />
          </svg>

     ),
     notFound: (props: IconProps) => (
          <svg version="1.1" id="Layer_2_00000091735031879081117480000013946010583091625126_"
               x="0px" y="0px" viewBox="0 0 623.6 220" fill="none" {...props}>
               <path fill="currentColor" d="M148.8,134V76h-48v58H71.4c-5.4,0-9.6,0.8-12.6,2.2s-5.7,3.9-8.1,7.4c-0.2,0.2-0.8,0.9-1.8,1.9
	s-2.2,1.6-3.6,1.6c-0.2,0-0.9-0.2-2.1-0.6c-1.4-0.8-2.1-1.9-2.1-3.3c0-1.2,0.6-2.8,1.8-4.8L81,75.2L53.1,49.1L0,129.2v45.6h100.8
	v40.8h48v-40.8h28.8V134L148.8,134L148.8,134z M311.8,0c-39.4,0-73.9,20.7-93.4,51.8l48.8,31.3c9.1-15.1,25.7-25.2,44.5-25.2
	c28.7,0,52,23.3,52,52c0,8.7-2.1,16.8-5.9,24h61.2c1.7-7.7,2.6-15.8,2.6-24C421.8,49.2,372.5,0,311.8,0z M311.8,162
	c-20,0-37.4-11.4-46.1-28h-61.2c10.9,49.2,54.9,86,107.4,86c23.5,0,45.3-7.4,63.1-19.9l-30.7-49.4C335.3,157.8,324,162,311.8,162
	L311.8,162z M594.8,134V76h-48v58h-29.4c-5.4,0-9.6,0.8-12.6,2.2s-5.7,3.9-8.1,7.4c-0.2,0.2-0.8,0.9-1.8,1.9s-2.2,1.6-3.6,1.6
	c-0.2,0-0.9-0.2-2.1-0.6c-1.4-0.8-2.1-1.9-2.1-3.3c0-1.2,0.6-2.8,1.8-4.8L527,75.2l-27.9-26.1L446,129.2v45.6h100.8v40.8h48v-40.8
	h28.8V134L594.8,134L594.8,134z"/>
          </svg>
     ),
     twitter: (props: IconProps) => (
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" {...props}>
               <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
          </svg>
     ),
     gitHub: (props: IconProps) => (
          <svg viewBox="0 0 438.549 438.549" {...props}>
               <path
                    fill="currentColor"
                    d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
               ></path>
          </svg>
     ),
     radix: (props: IconProps) => (
          <svg viewBox="0 0 25 25" fill="none" {...props}>
               <path
                    d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"
                    fill="currentcolor"
               ></path>
               <path d="M12 0H4V8H12V0Z" fill="currentcolor"></path>
               <path
                    d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"
                    fill="currentcolor"
               ></path>
          </svg>
     ),
     aria: (props: IconProps) => (
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
               <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
          </svg>
     ),
     npm: (props: IconProps) => (
          <svg viewBox="0 0 24 24" {...props}>
               <path
                    d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
                    fill="currentColor"
               />
          </svg>
     ),
     yarn: (props: IconProps) => (
          <svg viewBox="0 0 24 24" {...props}>
               <path
                    d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z"
                    fill="currentColor"
               />
          </svg>
     ),
     pnpm: (props: IconProps) => (
          <svg viewBox="0 0 24 24" {...props}>
               <path
                    d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z"
                    fill="currentColor"
               />
          </svg>
     ),
     react: (props: IconProps) => (
          <svg viewBox="0 0 24 24" {...props}>
               <path
                    d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
                    fill="currentColor"
               />
          </svg>
     ),
     tailwind: (props: IconProps) => (
          <svg viewBox="0 0 24 24" {...props}>
               <path
                    d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"
                    fill="currentColor"
               />
          </svg>
     ),
     google: (props: IconProps) => (
          <svg role="img" viewBox="0 0 24 24" {...props}>
               <path
                    fill="currentColor"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
               />
          </svg>
     ),
     apple: (props: IconProps) => (
          <svg role="img" viewBox="0 0 24 24" {...props}>
               <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
               />
          </svg>
     ),
     paypal: (props: IconProps) => (
          <svg role="img" viewBox="0 0 24 24" {...props}>
               <path
                    d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"
                    fill="currentColor"
               />
          </svg>
     ),
     verified: (props: IconProps) => (
          <svg viewBox="0 0 22 22" aria-label="Verified account" data-testid="icon-verified" className={cn("", props.className)} {...props}>
               <g>
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
               </g>
          </svg>
     ),
}