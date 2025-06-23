import { expect } from '@rstest/core'
import * as jestDomMatchers from '@testing-library/jest-dom/matchers'

if (globalThis.HTMLCanvasElement) {
  // @ts-ignore
  globalThis.HTMLCanvasElement.prototype.getContext = function () {
    return {
      fillRect: function () {},
      clearRect: function () {},
      getImageData: function (x, y, w, h) {
        return {}
      },
      putImageData: function () {},
      createImageData: function () {
        return []
      },
      setTransform: function () {},
      drawImage: function () {},
      save: function () {},
      fillText: function () {},
      restore: function () {},
      beginPath: function () {},
      moveTo: function () {},
      lineTo: function () {},
      closePath: function () {},
      stroke: function () {},
      translate: function () {},
      scale: function () {},
      rotate: function () {},
      arc: function () {},
      fill: function () {},
      measureText: function () {
        return {}
      },
      transform: function () {},
      rect: function () {},
      clip: function () {},
    }
  }
}

expect.extend(jestDomMatchers)
