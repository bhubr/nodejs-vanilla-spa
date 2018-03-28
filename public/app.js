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

const controllers = {

  '/': () =>
    fetch('/pirates')
    .then(res => res.json())
    .then(pirates => pirates.reduce((carry, pirate) => carry + makeCard(pirate), ''))
    .then(album => render(
    `
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#">Fixed navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="splash-box">
      <div class="container">
        <div class="row search">
          <div class="col-md-10 input-group input-group-lg">
            <input class="form-control" />
          </div>
          <div class="col-md-2">
            <input class="btn btn-lg btn-primary" type="submit" value="Search" />
          </div>
        </div>
      </div>
    </div>`)

  ),

  '/users/new': () => {
    render(
    `<div class="container">
      <div id="alert-box" class="hidden">

      </div>
      <form id="add-pirate">
        <div class="form-group">
          <label for="inputFirstName">First name</label>
          <input name="firstName" type="text" class="form-control" id="inputFirstName" placeholder="Enter first name">
        </div>
        <div class="form-group">
          <label for="inputLastName">Last name</label>
          <input name="lastName" type="text" class="form-control" id="inputLastName" placeholder="Enter last name">
        </div>
        <div class="form-group">
          <label for="inputImageUrl">Image URL</label>
          <input name="image" type="text" class="form-control" id="inputImageUrl" placeholder="Enter image URL">
        </div>
        <div class="form-group">
          <label for="inputBio">Bio</label>
          <textarea name="bio" class="form-control" id="inputLastName" placeholder="Bio"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>`
  )
    const form = document.getElementById('add-pirate')
    form.addEventListener('submit', e => {
      e.preventDefault()
      const data = serializeForm(form)
      if(! data.image) {
        const fullName = encodeURIComponent(`${data.firstName} ${data.lastName}`)
        data.image = `https://via.placeholder.com/640x480/?text=${fullName}`
      }
      fetch('/pirates', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(pirate => {
        const alertBox = document.getElementById('alert-box')
        alertBox.className = 'alert alert-success'
        alertBox.innerHTML = `Successfully created pirate ${pirate.firstName} (${pirate.id})`
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

  ['/', '/about', '/users/new', '/users/:slug', '*'].forEach(
    path => page(path, controllers[path])
  )
  page()
  // route()

})()