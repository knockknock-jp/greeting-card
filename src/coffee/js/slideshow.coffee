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
      @_$carousel = $ "#js-archivesCarousel"
      @_$item = @_$target.find(".js-archivesItem").clone()
      @_$data = @_$target.find "#js-archivesData"
      @_$msg = @_$target.find "#js-archivesMsg"
      @_$name = @_$target.find "#js-archivesName"
      @_archives = values.getArchives()
      #
      @_$items.empty()
      @_setItem()
      @_$carousel.carousel()
      # イベント
      @_$carousel.on "slide.bs.carousel", @_startSlide
      @_$carousel.on "slid.bs.carousel", @_completeSlide

    _startSlide: (e)=>
        @_$data.velocity {
          opacity: [0, 1]
        }, {
          duration: 200
          easing: "linear"
        }

    _completeSlide: (e)=>
        $item = $ e.relatedTarget
        data = values.getArchiveById $item.attr("id")
        @_$name.html decodeURIComponent(data.name)
        @_$msg.html decodeURIComponent(data.message)
        @_$data.velocity {
          opacity: [1, 0]
        }, {
          duration: 500
          easing: "linear"
        }

    _setItem: ->
      for data, i in @_archives
        $item = @_$item.clone()
        item = new archives.Item {
          $target: $item
          id: data.id
        }
        @_$items.append $item
        if i is 0
          $item.addClass "active"
          data = values.getArchiveById data.id
          @_$name.html decodeURIComponent(data.name)
          @_$msg.html decodeURIComponent(data.message)
        item.open()

  class archives.Item
    constructor: (params)->
      @_$target = params.$target
      @_id = params.id
      #
      @_$img = @_$target.find ".js-archivesItemImg"
      @_data = null
      #
      @_$target.attr "id", @_id

    open: ->
      @_data = values.getArchiveById @_id
      @_$target.velocity {
        opacity: [1, 0]
      }, {
        duration: 500
        easing: "linear"
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
      }

  class Modal
    constructor: (params)->
      @_$target = params.$target
      #
      @_getArchives = new modal.GetArchives {
        $target: $ "#js-modalGetArchives"
      }

    # 開く
    open: (e)->
      if e.id is ID_MODAL_GET_ARCHIVES
        # 開く
        @_getArchives.open {
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