import React from 'react'
import { TemplateEditor } from 'template-editor'
import 'template-editor/dist/index.css';
import { products, logos } from './mocks';
const App = () => {
  console.log(products[0])
  return <TemplateEditor product={products[0]} logos={logos} />
}

export default App
