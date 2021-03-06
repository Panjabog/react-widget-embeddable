import React from 'react'
import ReactDOM from 'react-dom'
import Widget from '../components/widget'
import KohWidget from '../components/kohwidget'
//import '../../vendor/cleanslate.css' //

export default class EmbeddableWidget {
  static el

  static mount({ parentElement = null, ...props } = {}) {
    const component = <KohWidget {...props} />

    function doRender() {
      if (EmbeddableWidget.el) {
        throw new Error('EmbeddableWidget is already mount, unmount first')
      }
      const el = document.createElement('div')
      el.setAttribute('id', 'kohlife-widget')
      el.setAttribute('class', 'cleanslate')

      if (parentElement) {
        document.querySelector(parentElement).appendChild(el)
      } else {
        document.body.appendChild(el)
      }
      ReactDOM.render(component, el)
      EmbeddableWidget.el = el
    }
    if (document.readyState === 'complete') {
      doRender()
    } else {
      window.addEventListener('load', () => {
        doRender()
      })
    }
  }

  static unmount() {
    if (!EmbeddableWidget.el) {
      throw new Error('EmbeddableWidget is not mounted, mount first')
    }
    ReactDOM.unmountComponentAtNode(EmbeddableWidget.el)
    EmbeddableWidget.el.parentNode.removeChild(EmbeddableWidget.el)
    EmbeddableWidget.el = null
  }
}
