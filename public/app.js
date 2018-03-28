const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}

const makeCard = item => `
  <div class="col-md-4">
    <div class="card mb-4 box-shadow">
      <img class="card-img-top" src="${item.image}" alt="Thumbnail [100%x225]" />
      <div class="card-body">
        <p class="card-text" style="height: 80px">${item.bio}</p>
        <a class="btn btn-primary" href="/users/${item.slug}">${item.firstName}'s profile &raquo;</a>
      </div>
    </div>
  </div>`

const serializeForm = form => {
  const data = {}
  const elements = form.getElementsByClassName('form-control')
  for(el of elements) {
    data[el.name] = el.value
  }
  return data
}

let hasMaps = false

function loadMapsIfNeeded(studios) {
  if(hasMaps) {
    initMap(studios)
  }
  else {
    loadJS(`https://maps.googleapis.com/maps/api/js?key=${window.mapsKey}&sensor=false`,
      () => {
      hasMaps = true
      initMap(studios)
    })
  }
}

function initMap(studios) {
  let map;
  const myLatLng = {lat: 43.597, lng: 1.454}

  console.log('initMap')

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 8
  });

  const infoWindows = studios.map(
    s => new google.maps.InfoWindow({
      content: `<h1 class="firstHeading">${s.name}</h1><p>${s.description}</p>`
    })
  )

  const markers =  studios.map(
    s => new google.maps.Marker({
      position: { lat: s.latitude, lng: s.longitude },
      map,
      title: s.name
    })
  )

  function getListener(i) {
    return () => infoWindows[i].open(map, markers[i])
  }

  markers.forEach((m, i) =>
    m.addListener('click', getListener(i))
  )

}


const controllers = {

  '/': () =>
    fetch('/studios')
    .then(res => res.json())
    .then(pirates => pirates.reduce((carry, pirate) => carry + makeCard(pirate), ''))
    .then(album => {
      render(
    `
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#">Fixed navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/yogis/new">+ <span class="sr-only">(current)</span></a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="splash-box">
      <div class="container">

        <form id="search">
          <div class="row search">
            <div class="col-md-10 input-group input-group-lg">
              <input name="s" class="form-control" />
            </div>
            <div class="col-md-2">
              <input class="btn btn-lg btn-primary" type="submit" value="Search" />
            </div>
          </div>
        </form>
      </div>
    </div><div id="map"></div>`)

    const form = document.getElementById('search')
    form.addEventListener('submit', e => {
      e.preventDefault()
      const data = serializeForm(form)
      console.log(data)

      fetch('/studios')
      .then(res => res.json())
      .then(studios => {

        $('#map').height(600)
        loadMapsIfNeeded(studios)

      })
    })


  }),

  '/yogis/new': () => {
    render(
      `<div class="container">
        <div id="alert-box" class="hidden">

        </div>
        <form id="add-pirate">
          <div class="form-group">
            <label for="inputName">Nom</label>
            <input name="name" type="text" class="form-control" id="inputName" placeholder="Enter studio name">
          </div>
          <div class="form-group">
            <label for="inputAddress">Address</label>
            <input name="address" type="text" class="form-control" id="inputAddress" placeholder="Enter address">
          </div>
          <div class="form-group">
            <label for="inputCity">City</label>
            <input name="city" type="text" class="form-control" id="inputCity" placeholder="Enter city">
          </div>
          <div class="form-group">
            <label for="inputDescription">Bio</label>
            <textarea name="description" class="form-control" id="inputDescription" placeholder="Description"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>`
    )
    const form = document.getElementById('add-pirate')
    form.addEventListener('submit', e => {
      e.preventDefault()
      const data = serializeForm(form)
      fetch('/studios', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(studio => {
        const alertBox = document.getElementById('alert-box')
        alertBox.className = 'alert alert-success'
        alertBox.innerHTML = `Successfully created studio ${studio.name} (${studio.id})`
      })
    })
  },

  '/users/:slug': ctx => {
    const { slug } = ctx.params
    fetch('/pirates')
    .then(res => res.json())
    .then(pirates => pirates.find(pirate => pirate.slug === slug))
    .then(pirate => render(`<div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src="${pirate.image}" alt="${pirate.firstName} ${pirate.lastName}" class="img-fluid" />
        </div>
        <div class="col-md-6">
          <h1>${pirate.firstName} ${pirate.lastName}</h1>
          <p>${pirate.bio}</p>
        </div>
      </div>
    </div>`))
  },

  '/about': () => render(
    `<div class="container">
      <section class="jumbotron text-center">
        <h1 class="jumbotron-heading">About Us</h1>
        <p class="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don't simply skip over it entirely.</p>
        <a class="btn btn-primary btn-lg" href="/" role="button">Back to home page »</a>
     </section>
    </div>`
  ),

  '*': () => render('<h1>Not Found</h1>')
}


const route = pathname => {

}


(() => {

  ['/', '/about', '/yogis/new', '/users/:slug', '*'].forEach(
    path => page(path, controllers[path])
  )
  page()
  // route()

})()