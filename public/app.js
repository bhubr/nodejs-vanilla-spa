const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}

const controllers = {

  '/': () => render(
    `<div class="container">
      <div class="jumbotron">
        <h1 class="display-3">Hello, world!</h1>
        <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        <p><a class="btn btn-primary btn-lg" href="/about" role="button">Learn more »</a></p>
      </div>
    </div>`
  ),


  '/about': () => render(
    `<div class="container">
      <section class="jumbotron text-center">
        <h1 class="jumbotron-heading">About Us</h1>
        <p class="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don't simply skip over it entirely.</p>
        <a class="btn btn-primary btn-lg" href="/" role="button">Back to home page »</a>
     </section>
    </div>`
  )
}


const route = pathname => {

}


(() => {

  ['/', '/about'].forEach(
    path => page(path, controllers[path])
  )
  page()
  // route()

})()