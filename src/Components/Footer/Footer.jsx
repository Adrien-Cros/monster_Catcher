import './footer.scss'

function Footer() {
  return (
    <footer>
      <div className="contributor">
        <div>Website made by Itchys / Adrien-Cros</div>
        <a
          href="https://github.com/Adrien-Cros/Ekrasys-Monster-Catcher"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </div>
      <div className="contributor">
        <div>Monster Artwork</div>
        <a
          href="https://twitter.com/aekashics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ækashics
        </a>
      </div>
    </footer>
  )
}

export default Footer
