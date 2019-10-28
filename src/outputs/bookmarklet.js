// import EmbeddableWidget from './embeddable-widget'

// export default function bookmarklet() {
//   console.log(window.Embeddable)

//   if (window.EmbeddableWidget) {
//     return
//   }
//   window.EmbeddableWidget = EmbeddableWidget

//   EmbeddableWidget.mount()
// }

// bookmarklet()

import EmbeddableWidget from './embeddable-widget'

export default function bookmarklet() {
  console.log(window.EmbeddableWidget)

  console.log()
  if (window.EmbeddableWidget) {
    return
  }
  window.EmbeddableWidget = EmbeddableWidget

  EmbeddableWidget.mount()
}

bookmarklet()
