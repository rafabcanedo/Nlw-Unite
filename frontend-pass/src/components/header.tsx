import nlwUniteIcon from "../assets/nlw-unite-icon.svg"

export function Header() {
 return (
  <div>
   <img src={nlwUniteIcon} alt="Nlw Icon" />

   <nav>
    <a>Events</a>
    <a>Members</a>
   </nav>

  </div>
 )
}