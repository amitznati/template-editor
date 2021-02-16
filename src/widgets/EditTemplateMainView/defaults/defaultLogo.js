import sideB from './sideB.jpg';
import sideT from './sideT.jpg';

export default {
  template: {
    templateGradients: [],
    templateFilters: [],
    layouts: [
      {
        type: 'text',
        properties: {
          text: 'Brand Name',
          dynamicOptionValue: 'Logo - Brand Name',
          x: 0,
          y: 0,
          transform: {
            translateY: 188.9765,
            translateX: 188.9765,
            scaleX: 1,
            scaleY: 1
          },
          filters: [],
          fontSize: 55,
          fontFamily: 'Raleway',
          fontStyle: 'normal',
          fontWeight: '300',
          fontProvider: 'google',
          strokeWidth: 0,
          stroke: '',
          fill: {
            fill: 'black'
          },
          themeColor: '',
          alignment: {
            horizontal: {
              value: 'center',
              alignmentAttributes: 'middle',
              align: true
            },
            vertical: {
              value: 'center',
              alignmentAttributes: 'middle',
              align: true
            }
          }
        }
      },
      {
        type: 'image',
        properties: {
          src: sideB,
          themeImage: '@theme-image-sideB',
          x: 0,
          y: 0,
          transform: {
            scaleX: '0.373',
            skewX: '0.000',
            skewY: '0.000',
            scaleY: '0.299',
            translateX: '-3.999',
            translateY: 207.224
          },
          filters: [],
          alignment: {
            vertical: {
              value: 'bottom',
              align: true
            }
          }
        }
      },
      {
        type: 'image',
        properties: {
          src: sideT,
          themeImage: '@theme-image-sideT',
          x: 0,
          y: 0,
          transform: {
            scaleX: '0.382',
            skewX: '0.000',
            skewY: '0.000',
            scaleY: '0.271',
            translateX: '-2.002',
            translateY: 0
          },
          filters: [],
          alignment: {
            vertical: {
              value: 'top',
              align: true
            }
          }
        }
      }
    ]
  }
};
