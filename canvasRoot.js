class Html2canvasRoot {
  constructor() {
    this.aspect_ratio = {
      '1/1': [ 1280, 1280 ],
      '4/5': [ 1024, 1280 ],
      '16/9': [ 2275.56, 1280 ]
    }

    this.root = $('#html2canvas-root')
    this.root_title = $('#root-title div')
    this.root_image = $('#root-background-image')

    this.root_aspect_ratio

    this.root.draggable({
      start: function() {
        $(this).css("opacity", "0.8")
        $(this).css("transition", "none")
        $(this).css("cursor", "crosshair")
      },
      stop: function() {
        $(this).css("opacity", "1")
        $(this).css("transition", "all 500ms cubic-bezier(.26,.29,0,1.18)")
        $(this).css("cursor", "auto")
      }
    })
  }
  
  center() {
    this.root
      .css('top', ((parseFloat($('#data-container').css('height')) / 2) - (parseFloat(this.root.css('height')) / 2)))
    this.root
      .css('left', ((parseFloat($('#data-container').css('width')) / 2) - (parseFloat(this.root.css('width')) / 2)))
  }

  textIncrement(stringElem, size = 0) {
    const elem = document.querySelectorAll(stringElem)[0] 
    const elemFontSize = parseFloat(window.getComputedStyle(elem).fontSize)
    

    if (size) {
      elem.style.fontSize = (elemFontSize + size) + "px"
    } else {
      elem.style.fontSize = (elemFontSize + 1)+ "px"
    }
  }

  textDecrement(stringElem, size = 0) {
    const elem = document.querySelectorAll(stringElem)[0] 
    const elemFontSize = parseFloat(window.getComputedStyle(elem).fontSize)
    

    if (size) {
      elem.style.fontSize = (elemFontSize - size) + "px"
    } else {
      elem.style.fontSize = (elemFontSize - 1) + "px"
    }
  }

  formatText(textarea_target, text_target, char){
    const textarea_elem = $(textarea_target)
    const text_elem = $(text_target)

    const main_string = textarea_elem.val()

    const str1 = main_string.slice(0, textarea_elem.get(0).selectionStart)
    const str2 = main_string.slice(textarea_elem.get(0).selectionEnd)
    const selectedStr = main_string.slice(textarea_elem.get(0).selectionStart, textarea_elem.get(0).selectionEnd)

    textarea_elem.val(str1 + (`<${char}>` + selectedStr + `</${char}>`) + str2)
    text_elem.html(str1 + (`<${char}>` + selectedStr + `</${char}>`) + str2)
    
    CanvasRoot.updateRootTitleSize()
  }

  updateZoom(zoom_value) {
    this.root.css('transform', `scale(${zoom_value/100})`)
  }

  updateRootTitleSize() {
    if (this.root_title.height() > 152) {
      this.root_title
        .css('font-size', parseInt(this.root_title.css('font-size')) - 0.2 + 'px');
      this.updateRootTitleSize()
    }
  }

  changeRootBackground(elem) {
    let reader = new FileReader()
    reader.onload = function (e) {
      $('#root-background-image').css('animation', '0')
      $('#root-background-image').css('background', `url(${e.target.result}) no-repeat center center`)
      
      $('#root-background-image').css('-webkit-background-size', 'cover')
      $('#root-background-image').css('-moz-background-size', 'cover')
      $('#root-background-image').css('background-size', 'cover')
        
      $('.data-background-item')
        .css('background', `url(${e.target.result}) no-repeat center center`)
    };
    reader.readAsDataURL(elem.files[0])
  }

  capture() {
    const saveTransform = (this.root.css('transform'))
  
    this.root.css('position', 'absolute')
    this.root.css('transform', 'scale(1)')
    this.root.css('transition', 'none')
  
    html2canvas(this.root[0], {
      allowTaint: true,
      useCORS: true,
    }).then(function(canvas) {
      var a = document.createElement('a');
      a.href = canvas.toDataURL("image/jpg");
      a.download = 'filé.jpg';
      a.click();
    });
  
    this.root.css('position', 'relative')
    this.root.css('transform', saveTransform)
    setTimeout(() => {
      this.root.css('transition', 'all 500ms cubic-bezier(.26,.29,0,1.18)')
    }, 200)
  }

}

var CanvasRoot = new Html2canvasRoot()

window.onload = function() {
  CanvasRoot.center()

  // events:

    // change the image position
    $('input[name="background-position-choice"]').click(function(el) {
      CanvasRoot.root_image
        .css('background-position', el.target.getAttribute('value'))
    })
    

    // automatic wrapping of textarea
    $('textarea').bind('input', function() {
      // $('#root-title div').html(elem.target.value)
      spans = [$('#root-title'), $('#root-info')]

      spans[$(this).data('root')].find('div').html($(this).val())

      if (!$(this).data('root')) {
        $('#root-title div').css('font-size', '4rem')
        CanvasRoot.updateRootTitleSize()
      }
    })


    // change the image aspect ratio
    $('input[name="aspect-ratio-choice"]').click(function(el) {
      root_aspect_ratio = el.target.getAttribute('value')
    
      CanvasRoot.root.css('min-width', CanvasRoot.aspect_ratio[root_aspect_ratio][0])
      CanvasRoot.root.css('max-width', CanvasRoot.aspect_ratio[root_aspect_ratio][0])
    
      CanvasRoot.root.css('min-height', CanvasRoot.aspect_ratio[root_aspect_ratio][1])
      CanvasRoot.root.css('max-height', CanvasRoot.aspect_ratio[root_aspect_ratio][1])
      
      CanvasRoot.root_title.css('font-size', '4rem')
      
      CanvasRoot.center()
      setTimeout(() => {
        CanvasRoot.center()
        CanvasRoot.updateRootTitleSize()
      }, 500)
    })
  //
}
