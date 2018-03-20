const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}

const makeCard = item => `
  <div class="col-md-4">
    <div class="card mb-4 box-shadow">
      <img class="card-img-top" src="${item.thumb}" alt="Thumbnail [100%x225]" />
      <div class="card-body">
        <p class="card-text" style="height: 80px">${item.text}</p>
        <a class="btn btn-primary" href="/users/${item.slug}">${item.firstName}"s profile &raquo;</a>
      </div>
    </div>
  </div>`


const controllers = {

  '/': () =>
    fetch('/pirates.json')
    .then(res => res.json())
    .then(pirates => pirates.reduce((carry, pirate) => carry + makeCard(pirate), ''))
    .then(album => render(
    `<div class="container">
      <div class="jumbotron">
        <h1 class="display-3">Hello, world!</h1>
        <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        <p><a class="btn btn-primary btn-lg" href="/about" role="button">Learn more »</a></p>
      </div>
      <div class="row">${album}</div>
    </div>`)

  ),

  '/users/:slug': ctx => {
    const { slug } = ctx.params
    fetch('/pirates.json')
    .then(res => res.json())
    .then(pirates => pirates.find(pirate => pirate.slug === slug))
    .then(pirate => render(`<div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src="${pirate.image}" alt="${pirate.firstName} ${pirate.lastName}" class="img-fluid" />
        </div>
        <div class="col-md-6">
          <h1>${pirate.firstName} ${pirate.lastName}</h1>
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

  ['/', '/about', '/users/:slug', '*'].forEach(
    path => page(path, controllers[path])
  )
  page()
  // route()

})()