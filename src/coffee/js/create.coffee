$ ->

  $window = $(window)
  $html = $("html")
  $body = $("body")

  canvas = {} unless canvas?
  tool = {} unless tool?
  tool.picture = {} unless tool.picture?
  modal = {} unless modal?

  ###
  定数
  ###

  CANVAS_WIDTH = 260
  CANVAS_HEIGHT = 260
  DEFAULT_STAMP_SRC = "./images/stamp/stamp-00.png"
  # ID
  ID_MODAL_FILE = "id_modal_file"
  ID_MODAL_DANGER = "id_modal_danger"
  ID_MODAL_STAMP = "id_modal_stamp"
  ID_MODAL_MSG = "id_modal_msg"
  ID_MODAL_UPLOAD = "id_modal_upload"
  # イベント
  EVENT_DRAW_IMAGE = "event_draw_image"
  EVENT_ADD_HISTORY = "event_add_history"
  EVENT_START_DRAG_AND_DROP = "event_start_drag_and_drop"
  EVENT_OPEN_MODAL = "event_open_modal"
  EVENT_CHANGE_TOOL = "event_change_tool"
  EVENT_CLEAR = "event_clear"

  ###
  モジュール
  ###

  class Values
    constructor: ->
      @_isPC = true
      ua = window.navigator.userAgent.toLowerCase()
      if 0 <= ua.indexOf("iphone") or 0 <= ua.indexOf("ipad") or 0 <= ua.indexOf("ipod")
        @_isPC = false
      else if 0 <= ua.indexOf("windows") and 0 <= ua.indexOf("phone")
        @_isPC = false
      else if 0 <= ua.indexOf("android") and 0 <= ua.indexOf("mobile")
        @_isPC = false
      else if 0 <= ua.indexOf("firefox") and 0 <= ua.indexOf("mobile")
        @_isPC = false
      else if 0 <= ua.indexOf("blackberry")
        @_isPC = false
      #
      @_isEdited = false
      @_isEnabledPen = false
      @_isEnabledStamp = false
      @_penOpacity = 1
      @_penThickness = 3
      @_penColor = "#333333"
      @_stampImg = null
      @_stampOpacity = 1
      @_stampSize = 50
      @_stampIsFlipHorizontal = false
      @_stampIsFlipVertical = false

    getIsPc: ->
      return Boolean @_isPC

    setIsEdited: (val)->
      if val is "false" or val is false
        @_isEdited = false
      else if val is "true" or val is true
        @_isEdited = true

    getIsEdited: ->
      return Boolean @_isEdited

    setPenOpacity: (val)->
      @_penOpacity = Number val

    getPenOpacity: ->
      return Number @_penOpacity

    setPenThickness: (val)->
      @_penThickness = Number val

    getPenThickness: ->
      return Number @_penThickness

    setPenColor: (val)->
      @_penColor = String val

    getPenColor: ->
      return String @_penColor

    setStampImg: (val)->
      @_stampImg = val

    getStampImg: ->
      return @_stampImg

    setStampOpacity: (val)->
      @_stampOpacity = Number val

    getStampOpacity: ->
      return Number @_stampOpacity

    setStampSize: (val)->
      @_stampSize = Number val

    getStampSize: ->
      return Number @_stampSize

    setStampIsFlipHorizontal: (val)->
      if val is "false" or val is false
        @_stampIsFlipHorizontal = false
      else if val is "true" or val is true
        @_stampIsFlipHorizontal = true

    getStampIsFlipHorizontal: ->
      return Boolean @_stampIsFlipHorizontal

    setStampIsFlipVertical: (val)->
      if val is "false" or val is false
        @_stampIsFlipVertical = false
      else if val is "true" or val is true
        @_stampIsFlipVertical = true

    getStampIsFlipVertical: ->
      return Boolean @_stampIsFlipVertical

    setIsEnabledPen: (val)->
      if val is "false" or val is false
        @_isEnabledPen = false
      else if val is "true" or val is true
        @_isEnabledPen = true

    getIsEnabledPen: ->
      return Boolean @_isEnabledPen

    setIsEnabledStamp: (val)->
      if val is "false" or val is false
        @_isEnabledStamp = false
      else if val is "true" or val is true
        @_isEnabledStamp = true

    getIsEnabledStamp: ->
      return Boolean @_isEnabledStamp

  class Header
    constructor: (params)->
      @_$target = params.$target
      #
      @_$btnLogo = $ "#js-headerBtnLogo"
      @_$btnCreate = $ "#js-headerBtnCreate"
      @_$btnGallery = $ "#js-headerBtnGallery"
      @_$btnSlideshow = $ "#js-headerBtnSlideshow"
      # イベント
      @_$btnLogo.on "click", @_onClickBtnLogo
      @_$btnCreate.on "click", @_onClickBtnCreate
      @_$btnGallery.on "click", @_onClickBtnGallery
      @_$btnSlideshow.on "click", @_onClickBtnSlideshow

    _onClickBtnLogo: (e)=>
      e.preventDefault()
      #
      @_changeLocation {
        msg: "Home"
        url: "./index.html"
      }

    _onClickBtnCreate: (e)=>
      e.preventDefault()
      #
      @_changeLocation {
        msg: "Create"
        url: "./create.html"
      }

    _onClickBtnGallery: (e)=>
      e.preventDefault()
      #
      @_changeLocation {
        msg: "Gallery"
        url: "./gallery.html"
      }

    _onClickBtnSlideshow: (e)=>
      e.preventDefault()
      #
      @_changeLocation {
        msg: "Slideshow"
        url: "./slideshow.html"
      }

    _changeLocation: (params)->
      if values.getIsEdited()
        # モーダルウィンドウ開くイベント
        $body.trigger EVENT_OPEN_MODAL, [{
          id: ID_MODAL_DANGER
          data: {
            ttl: "Danger"
            msg: "&nbsp;" + params.msg + "ページに遷移する場合、現在編集中のカードは削除されますがよろしいですか？"
            agree: =>
              location.href = params.url
          }
        }]
      else
        location.href = params.url

  class Canvas
    constructor: (params)->
      @_$target = params.$target
      #
      @_$canvas = $ "#js-canvasCanvas"
      @_$btnOk = $ "#js-canvasBtnOk"
      @_$btnClear = $ "#js-canvasBtnClear"
      @_$btnBack = $ "#js-canvasBtnBack"
      @_context = @_$canvas.get(0).getContext "2d"
      if values.getIsPc()
        @_pen = new canvas.PenPc {
          $canvas: @_$canvas
          context: @_context
        }
        @_stamp = new canvas.StampPc {
          $canvas: @_$canvas
          context: @_context
        }
      else
        @_pen = new canvas.PenSp {
          $canvas: @_$canvas
          context: @_context
        }
        @_stamp = new canvas.StampSp {
          $canvas: @_$canvas
          context: @_context
        }
      @_imageDataArr = []
      # イベント
      @_$btnClear.on "click", @_onClickClear
      @_$btnBack.on "click", @_onClickBack
      @_$btnOk.on "click", @_onClickOk

    # キャンバスにイメージを描画
    drawImage: (params)->
      @_context.globalAlpha = params.opacity
      @_context.drawImage params.target, params.x, params.y, params.width, params.height

    # ヒストリー追加
    addHistory: ->
      @_imageDataArr.push @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      @_setBtnActivate()
      values.setIsEdited true

    # ドラッグ&ドロップ機能開始
    startDragAndDrop: ->
      @_$canvas.get(0).addEventListener "dragover", (e)->
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
      , false
      @_$canvas.get(0).addEventListener "drop", (e)=>
        e.stopPropagation()
        e.preventDefault()
        reader = new FileReader()
        reader.readAsDataURL e.dataTransfer.files[0]
        reader.onload = ()=>
          img = new Image()
          img.src = reader.result
          img.onload = ()=>
            if (CANVAS_HEIGHT / img.height) < (CANVAS_WIDTH / img.width)
              width = CANVAS_WIDTH
              height = CANVAS_WIDTH * (img.height / img.width)
              x = 0
              y = -(height - CANVAS_HEIGHT) / 2
            else
              width =  CANVAS_HEIGHT * (img.width / img.height)
              height = CANVAS_HEIGHT
              x = -(width - CANVAS_WIDTH) / 2
              y = 0
            # キャンバスにイメージを描画イベント
            $body.trigger EVENT_DRAW_IMAGE, [{
              target: img
              x: x
              y: y
              width: width
              height: height
            }]
            # ヒストリー追加イベント
            $body.trigger EVENT_ADD_HISTORY
      , false

    # ツール変更
    changTool: ->
      if values.getIsEnabledPen()
        @_pen.setActive()
        @_stamp.deleteActive()
      else if values.getIsEnabledStamp()
        @_pen.deleteActive()
        @_stamp.setActive()
      else
        @_pen.deleteActive()
        @_stamp.deleteActive()

    # クリア
    clear: ->
      @_imageDataArr = []
      @_context.clearRect 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      @_setBtnActivate()
      values.setIsEdited false

    _onClickClear: =>
      # モーダルウィンドウ開くイベント
      $body.trigger EVENT_OPEN_MODAL, [{
        id: ID_MODAL_DANGER
        data: {
          ttl: "Danger"
          msg: "&nbsp;カードを削除しますがよろしいですか？"
          agree: =>
            @clear()
        }
      }]

    _onClickBack: =>
      if 2 <= @_imageDataArr.length
        arr = []
        for imageData, i in @_imageDataArr
          if i < @_imageDataArr.length - 1
            arr.push imageData
        @_imageDataArr = arr
        @_context.putImageData @_imageDataArr[@_imageDataArr.length - 1], 0, 0
        @_setBtnActivate()
      else
        @clear()

    _onClickOk: =>
      # モーダルウィンドウ開くイベント
      $body.trigger EVENT_OPEN_MODAL, [{
        id: ID_MODAL_MSG
        data: {
          src: @_$canvas.get(0).toDataURL()
          save: (e)=>
            @_onSaved {
              name: e.name
              msg: e.msg
              pw: e.pw
            }
        }
      }]

    _onSaved: (params)=>
      # モーダルウィンドウ開くイベント
      $body.trigger EVENT_OPEN_MODAL, [{
        id: ID_MODAL_UPLOAD
        data: {
          src: @_$canvas.get(0).toDataURL()
          name: params.name
          msg: params.msg
          pw: params.pw
        }
      }]

    _setBtnActivate: ->
      if 1 <= @_imageDataArr.length
        @_$btnOk.prop "disabled", false
        @_$btnClear.prop "disabled", false
        @_$btnBack.prop "disabled", false
      else
        @_$btnOk.prop "disabled", true
        @_$btnClear.prop "disabled", true
        @_$btnBack.prop "disabled", true

  class canvas.PenPc
    constructor: (params)->
      @_$canvas = params.$canvas
      @_context = params.context
      #
      @_startX = null
      @_startY = null
      @_imageData = null
      @_isDrawing = false

    setActive: ->
      # イベント
      @_$canvas.on "mouseenter", @_onMouseEnter
      @_$canvas.on "mousedown", @_onMouseDown
      @_$canvas.on "mousemove", @_onMouseMove
      @_$canvas.on "mouseup", @_onMouseUp
      @_$canvas.on "mouseleave", @_onMouseLeave

    deleteActive: ->
      # イベント
      @_$canvas.off "mouseenter", @_onMouseEnter
      @_$canvas.off "mousedown", @_onMouseDown
      @_$canvas.off "mousemove", @_onMouseMove
      @_$canvas.off "mouseup", @_onMouseUp
      @_$canvas.off "mouseleave", @_onMouseLeave

    _onMouseEnter: (e)=>
      e.preventDefault()
      #
      @_context.lineCap = "round"
      @_context.lineJoin = "round"
      @_context.strokeStyle = values.getPenColor()
      @_context.lineWidth = values.getPenThickness()
      @_context.globalAlpha = values.getPenOpacity()
      @_startX = e.pageX - $(e.target).offset().left
      @_startY = e.pageY - $(e.target).offset().top
      @_imageData = @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      @_onMouseMove e

    _onMouseDown: (e)=>
      e.preventDefault()
      #
      @_isDrawing = true
      @_startX = e.pageX - $(e.target).offset().left
      @_startY = e.pageY - $(e.target).offset().top
      @_onMouseMove(e)

    _onMouseMove: (e)=>
      e.preventDefault()
      #
      if not @_isDrawing
        if @_imageData
          @_context.putImageData @_imageData, 0, 0
      x = e.pageX - $(e.target).offset().left
      y = e.pageY - $(e.target).offset().top
      @_context.beginPath()
      @_context.moveTo @_startX, @_startY
      @_context.lineTo x + 0.1, y + 0.1
      @_context.closePath()
      @_context.stroke()
      @_startX = x
      @_startY = y
      if @_isDrawing
        @_imageData = @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT

    _onMouseUp: (e)=>
      e.preventDefault()
      #
      if @_isDrawing
        # ヒストリー追加イベント
        $body.trigger EVENT_ADD_HISTORY
        @_isDrawing = false

    _onMouseLeave: (e)=>
      e.preventDefault()
      #
      if @_imageData
        @_context.putImageData @_imageData, 0, 0
        @_imageData = null
      if @_isDrawing
        # ヒストリー追加イベント
        $body.trigger EVENT_ADD_HISTORY
        @_isDrawing = false

  class canvas.PenSp
    constructor: (params)->
      @_$canvas = params.$canvas
      @_context = params.context
      #
      @_startX = null
      @_startY = null

    setActive: ->
      # イベント
      @_$canvas.on "touchstart", @_onTouchStart
      @_$canvas.on "touchmove", @_onTouchMove
      @_$canvas.on "touchend", @_onTouchEnd

    deleteActive: ->
      # イベント
      @_$canvas.off "touchstart", @_onTouchStart
      @_$canvas.off "touchmove", @_onTouchMove
      @_$canvas.off "touchend", @_onTouchEnd

    _onTouchStart: (e)=>
      e.preventDefault()
      #
      @_context.lineCap = "round"
      @_context.lineJoin = "round"
      @_context.strokeStyle = values.getPenColor()
      @_context.lineWidth = values.getPenThickness()
      @_context.globalAlpha = values.getPenOpacity()
      @_startX = e.originalEvent.touches[0].clientX - $(e.target).offset().left
      @_startY = e.originalEvent.touches[0].clientY - $(e.target).offset().top + $window.scrollTop()
      @_onTouchMove(e)

    _onTouchMove: (e)=>
      e.preventDefault()
      #
      x = e.originalEvent.touches[0].clientX - $(e.target).offset().left
      y = e.originalEvent.touches[0].clientY - $(e.target).offset().top + $window.scrollTop()
      @_context.beginPath()
      @_context.moveTo @_startX, @_startY
      @_context.lineTo x + 0.1, y + 0.1
      @_context.closePath()
      @_context.stroke()
      @_startX = x
      @_startY = y

    _onTouchEnd: (e)=>
      e.preventDefault()
      #
      # ヒストリー追加イベント
      $body.trigger EVENT_ADD_HISTORY
      @_isDrawing = false

  class canvas.BaseStamp
    constructor: (params)->
      @_$canvas = params.$canvas
      @_context = params.context
      #
      @_img = null
      @_size = null
      @_imageData = null

    _draw: (x, y)->
      @_context.save()
      # 反転
      isFlipHorizontal = values.getStampIsFlipHorizontal()
      isFlipVertical = values.getStampIsFlipVertical()
      if isFlipHorizontal and not isFlipVertical
        # 左右反転
        @_context.scale -1, 1
        @_context.translate -CANVAS_WIDTH, 0
        x = CANVAS_WIDTH - x - @_size
      else if not isFlipHorizontal and isFlipVertical
        # 上下反転
        @_context.scale 1, -1
        @_context.translate 0, -CANVAS_HEIGHT
        y = CANVAS_HEIGHT - y - @_size
      else if isFlipHorizontal and isFlipVertical
        # 上下左右反転
        @_context.scale -1, -1
        @_context.translate -CANVAS_WIDTH, -CANVAS_HEIGHT
        x = CANVAS_WIDTH - x - @_size
        y = CANVAS_HEIGHT - y - @_size
      # キャンバスにイメージを描画イベント
      $body.trigger EVENT_DRAW_IMAGE, [{
        target: @_img
        x: x
        y: y
        width: @_size
        height: @_size
        opacity: values.getStampOpacity()
      }]
      @_context.restore()

  class canvas.StampPc extends canvas.BaseStamp
    constructor: (params)->
      super params

    setActive: ->
      # イベント
      @_$canvas.on "mouseenter", @_onMouseEnter
      @_$canvas.on "mousedown", @_onMouseDown
      @_$canvas.on "mousemove", @_onMouseMove
      @_$canvas.on "mouseleave", @_onMouseLeave

    deleteActive: ->
      # イベント
      @_$canvas.off "mouseenter", @_onMouseEnter
      @_$canvas.off "mousedown", @_onMouseDown
      @_$canvas.off "mousemove", @_onMouseMove
      @_$canvas.off "mouseleave", @_onMouseLeave

    _onMouseEnter: (e)=>
      e.preventDefault()
      #
      @_img = values.getStampImg()
      @_size = values.getStampSize()
      @_imageData = @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      @_onMouseMove e

    _onMouseMove: (e)=>
      e.preventDefault()
      #
      x = e.pageX - $(e.target).offset().left - (@_size / 2)
      y = e.pageY - $(e.target).offset().top - (@_size / 2)
      if @_imageData
        @_context.putImageData @_imageData, 0, 0
      @_draw x, y

    _onMouseDown: (e)=>
      e.preventDefault()
      #
      if @_imageData
        @_context.putImageData @_imageData, 0, 0
      x = e.pageX - $(e.target).offset().left - (@_size / 2)
      y = e.pageY - $(e.target).offset().top - (@_size / 2)
      @_draw x, y
      @_imageData = @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      # ヒストリー追加イベント
      $body.trigger EVENT_ADD_HISTORY

    _onMouseLeave: (e)=>
      if @_imageData
        @_context.putImageData @_imageData, 0, 0

  class canvas.StampSp extends canvas.BaseStamp
    constructor: (params)->
      super params
      @_x = 0
      @_y = 0
      @_isEnter = false

    setActive: ->
      # イベント
      @_$canvas.on "touchstart", @_onTouchStart
      @_$canvas.on "touchmove", @_onTouchMove
      @_$canvas.on "touchend", @_onTouchEnd

    deleteActive: ->
      # イベント
      @_$canvas.off "touchstart", @_onTouchStart
      @_$canvas.off "touchmove", @_onTouchMove
      @_$canvas.off "touchend", @_onTouchEnd

    _onTouchStart: (e)=>
      e.preventDefault()
      #
      @_img = values.getStampImg()
      @_size = values.getStampSize()
      @_imageData = @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      @_onTouchMove e

    _onTouchMove: (e)=>
      e.preventDefault()
      clientX = e.originalEvent.touches[0].clientX
      clientY = e.originalEvent.touches[0].clientY + $window.scrollTop()
      top = $(e.target).offset().top
      left = $(e.target).offset().left
      if @_imageData
        @_context.putImageData @_imageData, 0, 0
      if clientX - left < 0 or CANVAS_WIDTH < clientX - left
        @_isEnter = false
        return
      if clientY - top < 0 or CANVAS_HEIGHT < clientY - top
        @_isEnter = false
        return
      @_isEnter = true
      @_x = clientX - left - (@_size / 2)
      @_y = clientY - top - (@_size / 2)
      @_draw @_x, @_y

    _onTouchEnd: (e)=>
      e.preventDefault()
      #
      if not @_isEnter
        return
      if @_imageData
        @_context.putImageData @_imageData, 0, 0
      @_draw @_x, @_y
      # ヒストリー追加イベント
      $body.trigger EVENT_ADD_HISTORY

  class Tool
    constructor: (params)->
      @_$target = params.$target
      #
      @_$tabPicture = $ "#js-toolTabPicture"
      @_$tabPen = $ "#js-toolTabPen"
      @_$tabStamp = $ "#js-toolTabStamp"
      @_picture = new tool.Picture {
        $target: $ "#js-toolPicture"
      }
      @_pen = new tool.Pen {
        $target: $ "#js-toolPen"
      }
      @_stamp = new tool.Stamp {
        $target: $ "#js-toolStamp"
      }
      # イベント
      @_$tabPicture.on "shown.bs.tab", (e)=>
        @_onChangeTab {
          id: "picture"
        }
      @_$tabPen.on "shown.bs.tab", (e)=>
        @_onChangeTab {
          id: "pen"
        }
      @_$tabStamp.on "shown.bs.tab", (e)=>
        @_onChangeTab {
          id: "stamp"
        }
      # ツール変更イベント
      $body.trigger EVENT_CHANGE_TOOL

    # ペンタブ表示時にメッセージモーダルを開いて入力すると、モーダルがスクロールできなくなるバグ対策
    #changeTagPicture: ->
    #  $("#js-toolTabPicture").tab "show"

    _onChangeTab: (e)->
      if e.id is "picture"
        values.setIsEnabledPen false
        values.setIsEnabledStamp false
      else if e.id is "pen"
        values.setIsEnabledPen true
        values.setIsEnabledStamp false
      else if e.id is "stamp"
        values.setIsEnabledPen false
        values.setIsEnabledStamp true
      # ツール変更イベント
      $body.trigger EVENT_CHANGE_TOOL

  class tool.Picture
    constructor: (params)->
      @_$target = params.$target
      #
      @_file = new tool.picture.File {
        $target: $ "#js-toolPictureFile"
      }
      @_camera = new tool.picture.Camera {
        $target: $ "#js-toolPictureCamera"
      }
      @_dragAndDrop = new tool.picture.DragAndDrop {
        $target: $ "#js-toolPictureDragAndDrop"
      }

  class tool.picture.File
    constructor: (params)->
      @_$target = params.$target
      # 機能判定
      if not window.File or not window.FileReader or not window.FileList or not window.Blob
        @_$target.css {
          display: "none"
        }
        return
      #
      @_$inputFile = $ "#js-toolPictureFileInputFile"
      # イベント
      @_$inputFile.on "change", @_onChange

    _onChange: (e)=>
      if values.getIsPc()
        file = e.target.files[0]
        reader = new FileReader()
        reader.readAsDataURL file
        reader.onload = (e)=>
          # モーダルウィンドウ開くイベント
          $body.trigger EVENT_OPEN_MODAL, [{
              id: ID_MODAL_FILE
              data: {
                src: reader.result
              }
            }]
          , false
      else
        loadImage e.target.files[0], (img)=>
          # モーダルウィンドウ開くイベント
          $body.trigger EVENT_OPEN_MODAL, [{
              id: ID_MODAL_FILE
              data: {
                img: img
              }
            }]
          , false
        , {
          maxWidth: CANVAS_WIDTH * 2
          maxHeight: CANVAS_HEIGHT * 2
          minWidth: CANVAS_WIDTH
          minHeight: CANVAS_HEIGHT
          canvas: true
          orientation: 6
        }

  class tool.picture.Camera
    constructor: (params)->
      @_$target = params.$target
      # 機能判定
      navigator.getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia or navigator.mozGetUserMedia or navigator.msGetUserMedia or null
      if not navigator.getUserMedia
        @_$target.css {
          display: "none"
        }
        return
      #
      @_$video = $ "#js-toolPictureCameraVideo"
      @_$btnPlay = $ "#js-toolPictureCameraBtnPlay"
      @_$btnStop = $ "#js-toolPictureCameraBtnStop"
      @_$btnStop2 = $ "#js-toolPictureCameraBtnStop2"
      @_$btnCapture = $ "#js-toolPictureCameraBtnCapture"
      @_localMediaStream = null
      @_isPlay = false
      #
      @_$btnStop.css {
        display: "block"
      }
      @_$btnCapture.css {
        display: "block"
      }
      # イベント
      @_$btnPlay.on "click", @_onClickPlay
      @_$btnCapture.on "click", @_onClickCapture
      @_$btnStop.on "click", @_onClickStop
      @_$btnStop2.on "click", @_onClickStop

    _onClickPlay: ()=>
      @_toggleView()
      flg = false
      $("html, body").animate {
        scrollTop: 1
      }, 500, "swing", ()=>
        if not flg
          flg = true
          return
        window.URL = window.URL or window.webkitURL
        navigator.getUserMedia({video: true}, (stream)=>
          @_$video.get(0).src = window.URL.createObjectURL stream
          @_$video.get(0).play()
          @_localMediaStream = stream
        , (e)=>
          console.log "Error : " + e
        )

    _onClickCapture: =>
      @_toggleView()
      # キャンバスにイメージを描画イベント
      $body.trigger EVENT_DRAW_IMAGE, [{
        target: @_$video.get(0)
        x: -43
        y: 0
        width: 346
        height: CANVAS_HEIGHT
      }]
      # ヒストリー追加イベント
      $body.trigger EVENT_ADD_HISTORY
      if @_localMediaStream
        @_localMediaStream.stop()
        @_localMediaStream = null

    _onClickStop: =>
      @_toggleView()
      if @_localMediaStream
        @_localMediaStream.stop()
        @_localMediaStream = null

    _toggleView: ->
      if @_isPlay
        @_$video.css {
          display: "none"
        }
        @_$btnCapture.prop "disabled", true
        @_$btnPlay.css {
          display: "block"
        }
        @_$btnStop.prop "disabled", true
        @_$btnStop2.css {
          display: "none"
        }
      else
        @_$video.css {
          display: "block"
        }
        @_$btnCapture.prop "disabled", false
        @_$btnPlay.css {
          display: "none"
        }
        @_$btnStop.prop "disabled", false
        @_$btnStop2.css {
          display: "block"
        }
      @_isPlay = not @_isPlay

  class tool.picture.DragAndDrop
    constructor: (params)->
      @_$target = params.$target
      # 機能判定
      if not values.getIsPc()
        @_$target.css {
          display: "none"
        }
        return
      # ドラッグ&ドロップ機能開始イベント
      $body.trigger EVENT_START_DRAG_AND_DROP

  class tool.Pen
    constructor: (params)->
      @_$target = params.$target
      #
      @_$preview = $ "#js-toolPenPreview"
      @_$canvas = $ "#js-toolPenCanvas"
      @_context = @_$canvas.get(0).getContext "2d"
      @_canvasSize = 0
      #
      @_changeOpacity {
        val: $("#js-toolPenOpacity").find(":selected").val()
      }
      @_changeThickness {
        val: $("input[name=js-toolPenThickness]:checked").val()
      }
      @_changeColor {
        val: $("input[name=js-toolPenColor]:checked").val()
      }
      @_setPreview()
      # イベント
      $("#js-toolPenOpacity").on "change", (e)=>
        @_changeOpacity {
          val: $(e.target).val()
        }
        @_setPreview()
      $("input[name=js-toolPenThickness]").on "change", (e)=>
        @_changeThickness {
          val: $(e.target).val()
        }
        @_setPreview()
      $("input[name=js-toolPenColor]").on "change", (e)=>
        @_changeColor {
          val: $(e.target).val()
        }
        @_setPreview()

    _changeOpacity: (params)->
      # グローバル値
      values.setPenOpacity Number params.val

    _changeThickness: (params)->
      thickness = Number params.val
      @_canvasSize = thickness
      if @_canvasSize < 60
        @_canvasSize = 60
      @_$preview.css {
        width: @_canvasSize + 32
      }
      @_$canvas.css {
        width: @_canvasSize
        height: @_canvasSize
      }
      # グローバル値
      values.setPenThickness thickness

    _changeColor: (params)->
      # グローバル値
      values.setPenColor String params.val

    _setPreview: ->
      @_context.clearRect 0, 0, @_canvasSize, @_canvasSize
      x = @_canvasSize / 2
      y = @_canvasSize / 2
      @_context.save()
      @_context.globalAlpha = values.getPenOpacity()
      @_context.lineCap = "round"
      @_context.lineJoin = "round"
      @_context.strokeStyle = values.getPenColor()
      @_context.lineWidth = values.getPenThickness()
      @_context.beginPath()
      @_context.moveTo x, y
      @_context.lineTo x + 0.1, y + 0.1
      @_context.closePath()
      @_context.stroke()
      @_context.restore()

  class tool.Stamp
    constructor: (params)->
      @_$target = params.$target
      #
      @_$preview = $ "#js-toolStampPreview"
      @_$canvas = $ "#js-toolStampCanvas"
      @_$btnType = $ "#js-toolStampBtnType"
      @_context = @_$canvas.get(0).getContext "2d"
      @_canvasSize = 0
      #
      @_changeOpacity {
        val: $("#js-toolStampOpacity").find(":selected").val()
      }
      @_changeSize {
        val: $("#js-toolStampSize").find(":selected").val()
      }
      @_changeFlip()
      $("<img>").attr("src", DEFAULT_STAMP_SRC).on "load", (e)=>
        @_changeType {
          img: e.target
        }
        @_setPreview()
      # イベント
      @_$btnType.on "click", @_openStampModal
      $("#js-toolStampOpacity").on "change", (e)=>
        @_changeOpacity {
          val: $(e.target).val()
        }
        @_setPreview()
      $("#js-toolStampSize").on "change", (e)=>
        @_changeSize {
          val: $(e.target).val()
        }
        @_setPreview()
      $("input[name=js-toolStampFlip]").on "change", =>
        @_changeFlip()
        @_setPreview()

    _openStampModal: =>
      # モーダルウィンドウ開くイベント
      $body.trigger EVENT_OPEN_MODAL, [{
        id: ID_MODAL_STAMP
        data: {
          select: (e)=>
            @_changeType {
              img: e.img
            }
            @_setPreview()
        }
      }]

    _changeFlip: ->
      isFlipHorizontal = false
      isFlipVertical = false
      $("input[name=js-toolStampFlip]:checked").each (i, element)=>
        if $(element).val() is "horizontal"
          isFlipHorizontal = true
        if $(element).val() is "vertical"
          isFlipVertical = true
      # グローバル値
      values.setStampIsFlipHorizontal isFlipHorizontal
      values.setStampIsFlipVertical isFlipVertical

    _changeOpacity: (params)->
      # グローバル値
      values.setStampOpacity Number params.val

    _changeSize: (params)->
      @_canvasSize = Number params.val
      if @_canvasSize < 70
        @_canvasSize = 70
      @_$preview.css {
        width: @_canvasSize + 32
      }
      @_$canvas.attr "width", @_canvasSize
      @_$canvas.attr "height", @_canvasSize
      # グローバル値
      values.setStampSize Number params.val

    _changeType: (params)->
      if params.img
        # グローバル値
        values.setStampImg params.img

    _setPreview: ->
      isFlipHorizontal = values.getStampIsFlipHorizontal()
      isFlipVertical = values.getStampIsFlipVertical()
      img = values.getStampImg()
      size = values.getStampSize()
      x = 0
      y = 0
      if size < @_canvasSize
        x = (@_canvasSize - size) / 2
        y = (@_canvasSize - size) / 2
      @_context.save()
      @_context.clearRect 0, 0, @_canvasSize, @_canvasSize
      # 反転
      if isFlipHorizontal and not isFlipVertical
        # 左右反転
        @_context.scale -1, 1
        @_context.translate -@_canvasSize, 0
      else if not isFlipHorizontal and isFlipVertical
        # 上下反転
        @_context.scale 1, -1
        @_context.translate 0, -@_canvasSize
      else if isFlipHorizontal and isFlipVertical
        # 上下左右反転
        @_context.scale -1, -1
        @_context.translate -@_canvasSize, -@_canvasSize
      @_context.globalAlpha = values.getStampOpacity()
      @_context.drawImage img, x, y, size, size
      @_context.restore()

  class Modal
    constructor: (params)->
      @_$target = params.$target
      #
      @_file = new modal.File {
        $target: $ "#js-modalFile"
      }
      @_stamp = new modal.Stamp {
        $target: $ "#js-modalStamp"
      }
      @_danger = new modal.Danger {
        $target: $ "#js-modalDanger"
      }
      @_msg = new modal.Msg {
        $target: $ "#js-modalMsg"
      }
      @_upload = new modal.Upload {
        $target: $ "#js-modalUpload"
      }

    # 開く
    open: (e)->
      if e.id is ID_MODAL_FILE
        # 開く
        @_file.open {
          src: e.data.src or null
          img: e.data.img or null
        }
      else if e.id is ID_MODAL_STAMP
        # 開く
        @_stamp.open {
          select: e.data.select
          cancel: e.data.cancel
        }
      else if e.id is ID_MODAL_DANGER
        # 開く
        @_danger.open {
          ttl: e.data.ttl
          msg: e.data.msg
          agree: e.data.agree
          cancel: e.data.cancel
        }
      else if e.id is ID_MODAL_MSG
        # 開く
        @_msg.open {
          src: e.data.src
          save: e.data.save
        }
      else if e.id is ID_MODAL_UPLOAD
        # 開く
        @_upload.open {
          src: e.data.src
          name: e.data.name
          msg: e.data.msg
          pw: e.data.pw
        }

  class modal.Stamp
    constructor: (params)->
      @_$target = params.$target
      #
      @_select = null
      # イベント
      @_$target.on "shown.bs.modal", @_onOpened

    # 開く
    open: (params)->
      @_select = params.select or null
      # モーダル開く
      @_$target.modal {
        remote: "./modal-stamp.html"
      }

    _onOpened: =>
      # イベント
      $("input[name=js-toolStampType]").on "change", @_onSelect

    _onSelect: (e)=>
      $img = $ "img"
      $img.attr "src", $(e.target).val()
      $img.on "load", =>
        if @_select
          @_select {
            img: $img.get(0)
          }
        # モーダル閉じる
        @_$target.modal "hide"

  class modal.Danger
    constructor: (params)->
      @_$target = params.$target
      #
      @_$ttl = $ "#js-modalDangerTtl"
      @_$txt = $ "#js-modalDangerTxt"
      @_$btnCancel = $ "#js-modalDangerBtnCancel"
      @_$btnAgree = $ "#js-modalDangerBtnAgree"
      @_cancel = null
      @_agree = null
      # イベント
      @_$btnAgree.on "click", @_onClickAgree
      @_$btnCancel.on "click", @_onCickCancel

    # 開く
    open: (params)->
      @_agree = params.agree or null
      @_cancel = params.cancel or null
      #
      @_$ttl.html params.ttl
      @_$txt.html params.msg
      #
      @_$target.on "hidden.bs.modal", @_onClose
      # モーダル開く
      @_$target.modal "show"

    _onClickAgree: =>
      if @_agree
        @_agree()
      # モーダル閉じる
      @_$target.off "hidden.bs.modal", @_onClose
      @_$target.modal "hide"

    _onCickCancel: =>
      if @_cancel
        @_cancel()
      # モーダル閉じる
      @_$target.off "hidden.bs.modal", @_onClose
      @_$target.modal "hide"

    _onClose: =>
      # モーダル閉じる
      @_$target.modal "hide"
      if @_cancel
        @_cancel()

  class modal.File
    constructor: (params)->
      @_$target = params.$target
      #
      @_$btnRotate = $ "#js-modalFileBtnRotate"
      @_$btnDecide = $ "#js-modalFileBtnDecide"
      @_$canvas = $ "#js-modalFileCanvas"
      @_context = @_$canvas.get(0).getContext "2d"
      @_img = null
      @_src = null
      # イベント
      @_$target.on "hidden.bs.modal", @_onClose
      @_$btnRotate.on "click", @_onClickRotate
      @_$btnDecide.on "click", @_onClickDecide

    # 開く
    open: (params)->
      if params.img
        @_img = params.img
        if (CANVAS_HEIGHT / @_img.height) < (CANVAS_WIDTH / @_img.width)
          width = CANVAS_WIDTH
          height = CANVAS_WIDTH * (@_img.height / @_img.width)
          x = 0
          y = -(height - CANVAS_HEIGHT) / 2
        else
          width =  CANVAS_HEIGHT * (@_img.width / @_img.height)
          height = CANVAS_HEIGHT
          x = -(width - CANVAS_WIDTH) / 2
          y = 0
        @_context.drawImage @_img, x, y, width, height
        # モーダル開く
        @_$target.modal "show"
      if params.src
        @_src = params.src
        @_img = new Image()
        @_img.src = @_src
        @_img.onload = ()=>
          if (CANVAS_HEIGHT / @_img.height) < (CANVAS_WIDTH / @_img.width)
            width = CANVAS_WIDTH
            height = CANVAS_WIDTH * (@_img.height / @_img.width)
            x = 0
            y = -(height - CANVAS_HEIGHT) / 2
          else
            width =  CANVAS_HEIGHT * (@_img.width / @_img.height)
            height = CANVAS_HEIGHT
            x = -(width - CANVAS_WIDTH) / 2
            y = 0
          @_context.drawImage @_img, x, y, width, height
          # モーダル開く
          @_$target.modal "show"

    _onClickRotate: =>
      imagedata = @_context.getImageData 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      data = imagedata.data
      w = CANVAS_WIDTH
      h = CANVAS_HEIGHT
      for i in [0..h]
        y = i * w
        for j in [i..w]
          s = (y + j) * 4
          t = (j * w + i) * 4
          r = data[s]
          g = data[s + 1]
          b = data[s + 2]
          a = data[s + 3]
          data[s] = data[t]
          data[s + 1] = data[t + 1]
          data[s + 2] = data[t + 2]
          data[s + 3] = data[t + 3]
          data[t] = r
          data[t + 1] = g
          data[t + 2] = b
          data[t + 3] = a
      for i in [0..h]
        y = i * w
        x = y + w
        for j in [0..w / 2]
          s = (y + j) * 4
          t = (x - j) * 4
          r = data[s]
          g = data[s + 1]
          b = data[s + 2]
          a = data[s + 3]
          data[s] = data[t]
          data[s + 1] = data[t + 1]
          data[s + 2] = data[t + 2]
          data[s + 3] = data[t + 3]
          data[t] = r
          data[t + 1] = g
          data[t + 2] = b
          data[t + 3] = a
      #
      @_context.clearRect 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      @_context.putImageData imagedata, 0, 0

    _onClickDecide: =>
      # キャンバスにイメージを描画イベント
      $body.trigger EVENT_DRAW_IMAGE, [{
        target: @_$canvas.get(0)
        x: 0
        y: 0
        width: CANVAS_WIDTH
        height: CANVAS_HEIGHT
      }]
      # ヒストリー追加イベント
      $body.trigger EVENT_ADD_HISTORY
      # モーダル閉じる
      @_$target.modal "hide"

    _onClose: =>
      @_src = null
      @_img = null
      @_context.clearRect 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT

  class modal.Msg
    constructor: (params)->
      @_$target = params.$target
      #
      @_$img = $ "#js-modalMsgImg"
      @_$inputName = $ "#js-modalMsgInputName"
      @_$textareaMsg = $ "#js-modalMsgTextareaMsg"
      @_$inputPw = $ "#js-modalMsgInputPw"
      @_$btnSave = $ "#js-modalMsgBtnSave"
      @_save = null
      # イベント
      @_$target.on "shown.bs.modal", @_completeOpen
      @_$target.on "hide.bs.modal", @_startClose
      @_$target.on "hidden.bs.modal", @_onClose
      @_$btnSave.on "click", @_onSave

    # 開く
    open: (params)->
      src = params.src
      @_save = params.save
      # イベント
      @_$inputName.on "keydown keyup keypress change", @_onChangeForm
      @_$textareaMsg.on "keydown keyup keypress change", @_onChangeForm
      @_$inputPw.on "keydown keyup keypress change", @_onChangeForm
      #
      @_$inputName.val null
      @_$textareaMsg.val null
      @_$inputPw.val null
      @_$btnSave.prop "disabled", true
      #
      if src
        @_$img.attr "src", src
      # モーダル開く
      @_$target.modal "show"

    _completeOpen: =>
      # バグ対策
      $("#js-tool").css {
        display: "none"
      }
      $("#js-info").css {
        display: "none"
      }

    _startClose: =>
      # バグ対策
      $("#js-tool").css {
        display: "block"
      }
      $("#js-info").css {
        display: "block"
      }

    _onChangeForm: =>
      name = @_$inputName.val()
      msg = @_$textareaMsg.val()
      if not name or not msg
        @_$btnSave.prop "disabled", true
      else
        @_$btnSave.prop "disabled", false

    _onSave: =>
      name = @_$inputName.val()
      msg = @_$textareaMsg.val().replace(/\r?\n/g, '<br>')
      pw = @_$inputPw.val()
      if not pw
        pw = "0000"
      if @_save
        @_save {
          name: name
          msg: msg
          pw: pw
        }
      # モーダル閉じる
      @_$target.modal "hide"

    _onClose: =>
      @_$img.attr "src", ""
      # イベント
      @_$inputName.off "keydown keyup keypress change", @_onChangeForm
      @_$textareaMsg.off "keydown keyup keypress change", @_onChangeForm
      @_$inputPw.off "keydown keyup keypress change", @_onChangeForm

  class modal.Upload
    constructor: (params)->
      @_$target = params.$target
      @_$contentSending = $ "#js-modalUploadContentSending"
      @_$contentComplete = $ "#js-modalUploadContentComplete"
      @_$contentError = $ "#js-modalUploadContentError"
      @_$btnToGallery = $ "#js-modalUploadBtnToGallery"
      @_$btnCreateAgain = $ "#js-modalUploadBtnCreateAgain"
      #
      @_id = null
      @_pw = null
      @_src = null
      @_name = null
      @_msg = null
      # イベント
      @_$target.on "shown.bs.modal", @_onOpened
      @_$btnToGallery.on "click", @_onClickToGallery
      @_$btnCreateAgain.on "click", @_onClickCreateAgain

    # 開く
    open: (params)->
      @_id = null
      @_src = params.src
      @_name = params.name
      @_msg = params.msg
      @_pw = params.pw
      @_toggleView {
        id: "sending"
      }
      # モーダル開く
      @_$target.modal {
        backdrop: "static"
        keyboard: false
      }

    _onOpened: =>
      image = @_src
      image = image.replace(/^data:image\/png;base64,/, "")
      $.ajax({
        url: "api/upload.php"
        type: "POST"
        data: {
          pw: @_pw
          image: image
          name: encodeURIComponent @_name
          message: encodeURIComponent @_msg
        }
        dataType: "json"
        cache: false
        timeout: 10000
      }).done((data)=>
        @_toggleView {
          id: "complete"
        }
        @_id = data.id
      ).fail((data)=>
        @_toggleView {
          id: "error"
        }
      )

    _onClickToGallery: =>
      if @_id
        location.href = "./gallery.html#" + @_id
      else
        location.href = "./gallery.html"

    _onClickCreateAgain: =>
      # モーダル閉じる
      @_$target.modal "hide"
      # クリアイベント
      $body.trigger EVENT_CLEAR

    _toggleView: (params)->
      if params.id is "sending"
        @_$contentSending.css {
          display: "block"
        }
        @_$contentComplete.css {
          display: "none"
        }
        @_$contentError.css {
          display: "none"
        }
      else if params.id is "complete"
        @_$contentSending.css {
          display: "none"
        }
        @_$contentComplete.velocity {
          opacity: [1, 0]
          translateY: [0, -50]
        }, {
          duration: 500
          easing: "easeOutSine"
          display: "block"
        }
        @_$contentError.css {
          display: "none"
        }
      else if params.id is "error"
        @_$contentSending.css {
          display: "none"
        }
        @_$contentComplete.css {
          display: "none"
        }
        @_$contentError.velocity {
          opacity: [1, 0]
          translateY: [0, -50]
        }, {
          duration: 500
          easing: "easeOutSine"
          display: "block"
        }

  ###
  イベント
  ###

  # キャンバスにイメージを描画イベント
  $body.on EVENT_DRAW_IMAGE, (e, data)->
    # キャンバスにイメージを描画
    _canvas.drawImage {
      target: data.target
      x: data.x
      y: data.y
      width: data.width
      height: data.height
      opacity: data.opacity or 1
    }

  # ヒストリー追加イベント
  $body.on EVENT_ADD_HISTORY, ->
    # ヒストリー追加
    _canvas.addHistory()

  # ドラッグ&ドロップ機能開始イベント
  $body.on EVENT_START_DRAG_AND_DROP, ->
    # ドラッグ&ドロップ機能開始
    _canvas.startDragAndDrop()

  # モーダルウィンドウ開くイベント
  $body.on EVENT_OPEN_MODAL, (e, data)->
    # 開く
    _modal.open {
      id: data.id
      data: data.data or null
    }
    #if data.id is ID_MODAL_MSG
    #  _tool.changeTagPicture()

  # ツール変更イベント
  $body.on EVENT_CHANGE_TOOL, ->
    # ツール変更
    _canvas.changTool()

  # クリアイベント
  $body.on EVENT_CLEAR, ->
    # クリア
    _canvas.clear()

  ###
  アクション
  ###

  values = new Values()

  _header = new Header {
    $target: $ "#js-header"
  }

  _canvas = new Canvas {
    $target: $ "#js-canvas"
  }

  _tool = new Tool {
    $target: $ "#js-tool"
  }

  _modal = new Modal {
    $target: $ "#js-modal"
  }