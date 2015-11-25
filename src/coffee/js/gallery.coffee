$ ->

  $window = $(window)
  $html = $("html")
  $document = $(document)
  $body = $("body")

  archives = {} unless archives?
  modal = {} unless modal?

  ###
  定数
  ###

  # ID
  ID_MODAL_GET_ARCHIVES = "id_modal_get_archives"
  ID_MODAL_DETAIL = "id_modal_detail"
  ID_MODAL_DELETE = "id_modal_delete"
  #
  LOAD_VOLUME = 8
  # イベント
  EVENT_OPEN_MODAL = "event_open_modal"

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
      @_archives = []

    getIsPc: ->
      return Boolean @_isPC

    setArchives: (arr)->
      @_archives = arr

    getArchives: ->
      return @_archives

    getArchiveById: (id)->
      if not id
        return null
      for archive in @_archives
        if archive.id is id
          return archive
      return null

  class Archives
    constructor: (params)->
      @_$target = params.$target
      #
      @_$items = $ "#js-archivesItems"
      @_$nav = $ "#js-archivesNav"
      @_$btnLoad = $ "#js-archivesBtnLoad"
      @_$item = @_$target.find(".js-archivesItem").clone()
      @_archives = values.getArchives()
      @_isComplete = false
      @_intervalId = null
      @_loadedItemCount = 0
      #
      @_$items.empty()
      @_setItem()
      # イベント
      @_$btnLoad.on "click", @_onClickLoad

    _onClickLoad: =>
      @_setItem()

    _setItem: ->
      items = []
      for data, i in @_archives
        if @_loadedItemCount <= i and i < @_loadedItemCount + LOAD_VOLUME
          $item = @_$item.clone()
          item = new archives.Item {
            $target: $item
            id: data.id
          }
          items.push item
          @_$items.append $item
      if 1 <= items.length
        @_loadedItemCount += LOAD_VOLUME
        totalDelay = 0
        for item, i in items
          item.open {
            delay: i * 100
          }
          totalDelay += 100
        if @_loadedItemCount <= @_archives.length
          if @_intervalId
            clearTimeout
          @_intervalId = setTimeout =>
            @_$nav.css {
              display: "block"
            }
          , totalDelay + 1000
        else
          @_$nav.css {
            display: "none"
          }

  class archives.Item
    constructor: (params)->
      @_$target = params.$target
      @_id = params.id
      #
      @_$thumb = @_$target.find ".js-archivesItemThumb"
      @_$img = @_$target.find ".js-archivesItemImg"
      @_$name = @_$target.find ".js-archivesItemName"
      @_$btnDetail = @_$target.find ".js-archivesItemBtnDetail"
      @_data = null
      #
      @_$target.attr "id", @_id

    open: (params)->
      @_data = values.getArchiveById @_id
      @_$name.text decodeURIComponent @_data.name
      @_$target.css {
        display: "block"
      }
      @_$thumb.css {
        visibility: "hidden"
      }
      @_$thumb.velocity {
        opacity: [1, 0]
        translateY: [0, 100]
        translateZ: [0, 100]
        rotateZ: [0, 10]
        rotateY: [0, 45]
      }, {
        duration: 1200
        easing: "easeOutQuint"
        delay: params.delay
        begin: =>
          @_$thumb.css {
            visibility: "visible"
          }
        complete: =>
          @_$img.attr "src", "./data/" + @_data.image
          @_$img.css {
            opacity: 0
          }
          @_$img.on "load", =>
            @_$img.velocity {
              opacity: [1, 0]
            }, {
              duration: 500
              easing: "linear"
            }
          # イベント
          @_$img.on "click", @_onClickDetail
          @_$btnDetail.on "click", @_onClickDetail
      }

    _onClickDetail: (e)=>
      e.preventDefault()
      # モーダルウィンドウ開くイベント
      $body.trigger EVENT_OPEN_MODAL, [{
          id: ID_MODAL_DETAIL
          data: {
            id: @_id
          }
        }]
      , false

  class Modal
    constructor: (params)->
      @_$target = params.$target
      #
      @_getArchives = new modal.GetArchives {
        $target: $ "#js-modalGetArchives"
      }
      @_detail = new modal.Detail {
        $target: $ "#js-modalDetail"
      }
      @_delete = new modal.Delete {
        $target: $ "#js-modalDelete"
      }

    # 開く
    open: (e)->
      if e.id is ID_MODAL_GET_ARCHIVES
        # 開く
        @_getArchives.open {
          success: e.data.success
        }
      else if e.id is ID_MODAL_DETAIL
        # 開く
        @_detail.open {
          id: e.data.id
        }
      else if e.id is ID_MODAL_DELETE
        # 開く
        @_delete.open {
          id: e.data.id
          success: e.data.success
        }

  class modal.GetArchives
    constructor: (params)->
      @_$target = params.$target
      #
      @_$connect = $ "#js-modalGetArchivesConnect"
      @_$failure = $ "#js-modalGetArchivesFailure"
      @_$msg = $ "#js-modalGetArchivesMsg"
      @_success = null
      @_data = null
      # イベント
      @_$target.on "shown.bs.modal", @_onOpened
      @_$target.on "hidden.bs.modal", @_onClosed

    # 開く
    open: (params)->
      @_success = params.success
      #
      @_toggleView {
        id: "connect"
      }
      # モーダル開く
      @_$target.modal {
        backdrop: "static"
        keyboard: false
      }

    _onOpened: =>
      $.ajax({
        url: "api/getArchives.php"
        type: "POST"
        dataType: "json"
        cache: false
        timeout: 10000
      }).done((data)=>
        if data.code is 0
          @_data = data.data
          # モーダル閉じる
          @_$target.modal "hide"
        else
          @_$msg.html data.msg
          @_toggleView {
            id: "failure"
          }
      ).fail(=>
        @_$msg.html "データの取得に失敗しました"
        @_toggleView {
          id: "failure"
        }
      )

    _onClosed: =>
      if @_success
        @_success {
          data: @_data
        }

    _toggleView: (params)->
      if params.id is "connect"
        @_$connect.css {
          display: "block"
        }
        @_$failure.css {
          display: "none"
        }
      else if params.id is "failure"
        @_$connect.css {
          display: "none"
        }
        @_$failure.velocity {
          opacity: [1, 0]
          translateY: [0, -50]
        }, {
          duration: 500
          easing: "easeOutSine"
          display: "block"
        }

  class modal.Detail
    constructor: (params)->
      @_$target = params.$target
      #
      @_$img = $ "#js-modalDetailImg"
      @_$name = $ "#js-modalDetailName"
      @_$msg = $ "#js-modalDetailMsg"
      @_$date = $ "#js-modalDetailDate"
      @_$btnTw = @_$target.find "#js-modalDetailBtnTw"
      @_$btnDelete = @_$target.find "#js-modalDetailBtnDelete"
      @_id = null
      # イベント
      @_$btnTw.on "click", @_onClickTw
      @_$btnDelete.on "click", @_onClickDelete

    # 開く
    open: (params)->
      if not params.id
        return
      @_id = params.id
      data = values.getArchiveById @_id
      if not data
        return
      @_$img.attr "src", "./data/" + data.image
      @_$name.html decodeURIComponent data.name
      @_$msg.html decodeURIComponent data.message
      @_$date.html data.date
      # モーダル開く
      @_$target.modal "show"

    _onClickDelete: (e)=>
      e.preventDefault()
      # モーダル閉じる
      @_$target.modal "hide"
      # モーダルウィンドウ開くイベント
      $body.trigger EVENT_OPEN_MODAL, [{
        id: ID_MODAL_DELETE
        data: {
          id: @_id
        }
      }]

    _onClickTw: (e)=>
      e.preventDefault()
      #
      data = values.getArchiveById @_id
      href = "https://twitter.com/intent/tweet"
      name = decodeURIComponent data.name
      name = "【" + name + "】"
      name = encodeURIComponent name
      message = decodeURIComponent data.message
      message = message.replace "<br>", ""
      if 50 < message.length
        message = message.substr(0, 50) + "..."
      message = encodeURIComponent message
      url = String(location.href).split("#")[0] + "#" + @_id
      url = encodeURIComponent url
      tweet = href + "?text=" + name + message + "&url=" + url
      window.open tweet, "tweet_window", "width=640, height=300, menubar=no, toolbar=no, scrollbars=no, resizable=yes"

  class modal.Delete
    constructor: (params)->
      @_$target = params.$target
      #
      @_$confirmation = $ "#js-modalDeleteConfirmation"
      @_$connect = $ "#js-modalDeleteConnect"
      @_$failure = $ "#js-modalDeleteFailure"
      @_$success = $ "#js-modalDeleteSuccess"
      @_$btnDelete = $ "#js-modalDeleteBtnDelete"
      @_$msg = $ "#js-modalDeleteMsg"
      @_$inputPw = $ "#js-modalDeleteInputPw"
      # イベント
      @_$btnDelete.on "click", @_onClickDelete
      @_$target.on "hidden.bs.modal", @_onClosed

    # 開く
    open: (params)->
      @_id = params.id
      #
      @_toggleView {
        id: "confirmation"
      }
      # モーダル開く
      @_$target.modal {
        backdrop: "static"
        keyboard: false
      }

    _onClickDelete: (e)=>
      e.preventDefault()
      #
      @_toggleView {
        id: "connect"
        complete: =>
          $.ajax({
            url: "api/delete.php"
            type: "POST"
            dataType: "json"
            data: {
              pw: @_$inputPw.val() || "0000"
              id: @_id
            }
            cache: false
            timeout: 10000
          }).done((data)=>
            if data.code is 0
              @_toggleView {
                id: "success"
              }
            else
              @_$msg.html data.msg
              @_toggleView {
                id: "failure"
              }
          ).fail(=>
            @_$msg.html "データの削除に失敗しました"
            @_toggleView {
              id: "failure"
            }
          )
      }

    _toggleView: (params)->
      complete = params.complete or null
      if params.id is "confirmation"
        @_$confirmation.css {
          display: "block"
        }
        @_$connect.css {
          display: "none"
        }
        @_$failure.css {
          display: "none"
        }
        @_$success.css {
          display: "none"
        }
      else if params.id is "connect"
        @_$confirmation.css {
          display: "none"
        }
        @_$connect.velocity {
          opacity: [1, 0]
          translateY: [0, -50]
        }, {
          duration: 500
          easing: "easeOutSine"
          display: "block"
          complete: =>
            if complete
              complete()
        }
        @_$failure.css {
          display: "none"
        }
        @_$success.css {
          display: "none"
        }
      else if params.id is "failure"
        @_$confirmation.css {
          display: "none"
        }
        @_$connect.css {
          display: "none"
        }
        @_$failure.velocity {
          opacity: [1, 0]
          translateY: [0, -50]
        }, {
          duration: 500
          easing: "easeOutSine"
          display: "block"
          complete: =>
            if complete
              complete()
        }
        @_$success.css {
          display: "none"
        }
      else if params.id is "success"
        @_$confirmation.css {
          display: "none"
        }
        @_$connect.css {
          display: "none"
        }
        @_$failure.css {
          display: "none"
        }
        @_$success.velocity {
          opacity: [1, 0]
          translateY: [0, -50]
        }, {
          duration: 500
          easing: "easeOutSine"
          display: "block"
          complete: =>
            if complete
              complete()
        }

  ###
  イベント
  ###

  # モーダルウィンドウ開くイベント
  $body.on EVENT_OPEN_MODAL, (e, data)->
    # 開く
    _modal.open {
      id: data.id
      data: data.data or null
    }

  ###
  アクション
  ###

  values = new Values()

  _modal = new Modal {
    $target: $ "#js-modal"
  }

  _archives = null

  # モーダルウィンドウ開くイベント
  $body.trigger EVENT_OPEN_MODAL, [{
      id: ID_MODAL_GET_ARCHIVES
      data: {
        success: (params)=>
          values.setArchives params.data
          #
          hash = location.hash
          if hash
            hash = String(hash).replace "#", ""
            data = values.getArchiveById hash
            if data
              # モーダルウィンドウ開くイベント
              $body.trigger EVENT_OPEN_MODAL, [{
                  id: ID_MODAL_DETAIL
                  data: {
                    id: data.id
                  }
                }]
              , false
          #
          _archives = new Archives {
            $target: $ "#js-archives"
          }
      }
    }]
  , false