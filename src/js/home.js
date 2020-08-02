document.getElementsByTagName("html")[0].style.overflow = "hidden";
(async function load() {


  
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
        TemplateHTML.classList.add('fadeIn')
        container.appendChild(TemplateHTML)
        clickMovie(TemplateHTML,movie.title,movie.medium_cover_image,movie.description_full)
      });
    }
    function movieFound(movie) {
      return (
        `<div class="featuring">
            <div class="featuring-image">
            <img src="${movie.medium_cover_image}" height="100" alt="">
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${movie.title}</p>
          </div>
        </div>
        `
        )
      }
      async function searchMovie (name) {
        const data = await getData(`https://yts.mx/api/v2/list_movies.json?query_term=${name}&limit=1`);
        return data.data.movies[0]
      }
      //formulario de busqueda de peliculas
      const home = document.getElementById('home')
      const form = document.getElementById('form')
      const featuringContainer = document.getElementById('featuring')
      const loader = document.createElement('img')
      loader.setAttribute('src','src/images/loader.gif')
      loader.setAttribute('width','50px')
      loader.setAttribute('height','50px')
      
      form.addEventListener('submit',async (event)=>{
        event.preventDefault()
        featuringContainer.innerHTML = ''
        home.classList.add('search-active')
        featuringContainer.append(loader) 
        const data = new FormData(form)
        try {
          const nameMovie = data.get('name')
          const MovieFound = await searchMovie(nameMovie)
          const HTMLTemplate = movieFound(MovieFound)
          featuringContainer.innerHTML = HTMLTemplate
        } catch (error) {
          home.classList.remove('search-active')
          loader.remove()
          swal ( "Oops" , `Peli ${data.get('name')} no encontrada` ,  "error" )
        }
      })
      
      //contenedor de usuarios de la playlist de amigos
      const containerPlayListFriends = document.getElementById('playlistFriends')
      
      const userPersons = await getData('https://randomuser.me/api/?results=5')
      const ArrayUser = userPersons.results
      ArrayUser.forEach((user)=>{
        const userHTML = templateFriendsPlayList(user)
        containerPlayListFriends.innerHTML += userHTML 
      })
    
      function templateFriendsPlayList(user) {
        return(
          `<li class="playlistFriends-item">
            <a href="#">
              <img src="${user.picture.medium}" alt="" />
              <span>
                ${user.name.first} ${user.name.last}
              </span>
            </a>
          </li>`
        )
      }
  
  //Traer las peliculas
  const actionContainer = document.getElementById('action')
  const animationContainer = document.getElementById('animation')
  const dramaContainer = document.getElementById('drama')
  
  if(localStorage.getItem('action List')){
    showMovies(JSON.parse(localStorage.getItem('action List')),actionContainer)
  }else{
    const actionList = await getData('https://yts.mx/api/v2/list_movies.json?genre=action')
    showMovies(actionList,actionContainer)
    localStorage.setItem('action List',JSON.stringify(actionList))
  }

  if(localStorage.getItem('animation List')){
    showMovies(JSON.parse(localStorage.getItem('animation List')),animationContainer)
  }else{
    const animationList = await getData('https://yts.mx/api/v2/list_movies.json?genre=animation')
    showMovies(animationList,animationContainer)
    localStorage.setItem('animation List',JSON.stringify(animationList))
  }

  if(localStorage.getItem('drama List')){
    showMovies(JSON.parse(localStorage.getItem('drama List')),dramaContainer)
  }else{
    const dramaList = await getData('https://yts.mx/api/v2/list_movies.json?genre=drama')
    showMovies(dramaList,dramaContainer)
    localStorage.setItem('drama List',JSON.stringify(dramaList))
  }
})()



