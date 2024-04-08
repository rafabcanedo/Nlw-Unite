import nlwUniteIcon from "../assets/nlw-unite-icon.svg"
import { NavLink } from "./nav-link"

export function Header() {
 return (
  <div className="flex items-center gap-5 py-2">
   <img src={nlwUniteIcon} alt="Nlw Icon" />

   <nav className="flex items-center gap-5">
    <a href="" className="font-medium text-sm text-zinc-300">Events</a>
    <NavLink href="/member">Members</NavLink>
   </nav>

  </div>
 )
}