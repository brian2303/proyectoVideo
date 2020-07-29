
(async function load() {

    const featuringContainer = document.getElementById('featuring')
    const modal = document.getElementById('modal')
    const overlay = document.getElementById('overlay')
    const hideModal = document.getElementById('hide-modal')
    const imgModal = modal.querySelector('img')
    const titleModal = modal.querySelector('h1')
    const descriptionModal = modal.querySelector('p')

    function showModal(title,image,description) {
      titleModal.innerHTML = title
      descriptionModal.innerHTML = description
      imgModal.setAttribute('src',image)
      overlay.classList.add('active')
      modal.style.animation = 'modalIn .8s forwards'
    }

    function Modalhide() {
      hideModal.addEventListener('click',()=>{
        modal.style.animation = 'modalOut .8s'
        overlay.classList.remove('active')
      })
    }
  
  //metodo para obtener las peliculas
  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
  }
  //generar un template de las peliculas
  function videoItemtemplate(movie) {
    return (
      `<div class="primaryPlayListItem">
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}" alt="">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }
  //convierte el templateString a elemento HTML
  function createTemplate(templateString){
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = templateString
    return html.body.children[0]
  }

  function clickMovie(movie,title,image,description) {
    movie.addEventListener('click',()=>{
      showModal(title,image,description)
      Modalhide()
    })
  }
  //metodo para mostrar las peliculas
  const showMovies = (typeMovie,container) =>{
    container.children[0].remove()
    typeMovie.data.movies.forEach(movie => {
      const MoviesTemplateString = videoItemtemplate(movie)
      const TemplateHTML = createTemplate(MoviesTemplateString)
      container.appendChild(TemplateHTML)
      clickMovie(TemplateHTML,movie.title,movie.medium_cover_image,movie.description_full)
    });
  }
  //formulario de busqueda de peliculas
  const home = document.getElementById('home')
  const form = document.getElementById('form')
  form.addEventListener('submit',(event)=>{
    event.preventDefault()
    home.classList.add('search-active')
  })

  //Traer las peliculas
  const actionList = await getData('https://yts.mx/api/v2/list_movies.json?genre=action')
  const animationList = await getData('https://yts.mx/api/v2/list_movies.json?genre=animation')
  const dramaList = await getData('https://yts.mx/api/v2/list_movies.json?genre=drama')
  
  // Renderizar los datos en pantalla
  const actionContainer = document.getElementById('action')
  showMovies(actionList,actionContainer)

  const animationContainer = document.getElementById('animation')
  showMovies(animationList,animationContainer)
  
  const dramaContainer = document.getElementById('drama')
  showMovies(dramaList,dramaContainer)
  

})()



