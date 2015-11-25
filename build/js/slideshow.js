var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(function() {
  var $body, $document, $html, $window, Archives, EVENT_OPEN_MODAL, ID_MODAL_GET_ARCHIVES, Modal, Values, _archives, _modal, archives, modal, values;
  $window = $(window);
  $html = $("html");
  $document = $(document);
  $body = $("body");
  if (typeof archives === "undefined" || archives === null) {
    archives = {};
  }
  if (typeof modal === "undefined" || modal === null) {
    modal = {};
  }

  /*
  定数
   */
  ID_MODAL_GET_ARCHIVES = "id_modal_get_archives";
  EVENT_OPEN_MODAL = "event_open_modal";

  /*
  モジュール
   */
  Values = (function() {
    function Values() {
      var ua;
      this._isPC = true;
      ua = window.navigator.userAgent.toLowerCase();
      if (0 <= ua.indexOf("iphone") || 0 <= ua.indexOf("ipad") || 0 <= ua.indexOf("ipod")) {
        this._isPC = false;
      } else if (0 <= ua.indexOf("windows") && 0 <= ua.indexOf("phone")) {
        this._isPC = false;
      } else if (0 <= ua.indexOf("android") && 0 <= ua.indexOf("mobile")) {
        this._isPC = false;
      } else if (0 <= ua.indexOf("firefox") && 0 <= ua.indexOf("mobile")) {
        this._isPC = false;
      } else if (0 <= ua.indexOf("blackberry")) {
        this._isPC = false;
      }
      this._archives = [];
    }

    Values.prototype.getIsPc = function() {
      return Boolean(this._isPC);
    };

    Values.prototype.setArchives = function(arr) {
      return this._archives = arr;
    };

    Values.prototype.getArchives = function() {
      return this._archives;
    };

    Values.prototype.getArchiveById = function(id) {
      var archive, j, len, ref;
      if (!id) {
        return null;
      }
      ref = this._archives;
      for (j = 0, len = ref.length; j < len; j++) {
        archive = ref[j];
        if (archive.id === id) {
          return archive;
        }
      }
      return null;
    };

    return Values;

  })();
  Archives = (function() {
    function Archives(params) {
      this._completeSlide = bind(this._completeSlide, this);
      this._startSlide = bind(this._startSlide, this);
      this._$target = params.$target;
      this._$items = $("#js-archivesItems");
      this._$carousel = $("#js-archivesCarousel");
      this._$item = this._$target.find(".js-archivesItem").clone();
      this._$data = this._$target.find("#js-archivesData");
      this._$msg = this._$target.find("#js-archivesMsg");
      this._$name = this._$target.find("#js-archivesName");
      this._archives = values.getArchives();
      this._$items.empty();
      this._setItem();
      this._$carousel.carousel();
      this._$carousel.on("slide.bs.carousel", this._startSlide);
      this._$carousel.on("slid.bs.carousel", this._completeSlide);
    }

    Archives.prototype._startSlide = function(e) {
      return this._$data.velocity({
        opacity: [0, 1]
      }, {
        duration: 200,
        easing: "linear"
      });
    };

    Archives.prototype._completeSlide = function(e) {
      var $item, data;
      $item = $(e.relatedTarget);
      data = values.getArchiveById($item.attr("id"));
      this._$name.html(decodeURIComponent(data.name));
      this._$msg.html(decodeURIComponent(data.message));
      return this._$data.velocity({
        opacity: [1, 0]
      }, {
        duration: 500,
        easing: "linear"
      });
    };

    Archives.prototype._setItem = function() {
      var $item, data, i, item, j, len, ref, results;
      ref = this._archives;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        data = ref[i];
        $item = this._$item.clone();
        item = new archives.Item({
          $target: $item,
          id: data.id
        });
        this._$items.append($item);
        if (i === 0) {
          $item.addClass("active");
          data = values.getArchiveById(data.id);
          this._$name.html(decodeURIComponent(data.name));
          this._$msg.html(decodeURIComponent(data.message));
        }
        results.push(item.open());
      }
      return results;
    };

    return Archives;

  })();
  archives.Item = (function() {
    function Item(params) {
      this._$target = params.$target;
      this._id = params.id;
      this._$img = this._$target.find(".js-archivesItemImg");
      this._data = null;
      this._$target.attr("id", this._id);
    }

    Item.prototype.open = function() {
      this._data = values.getArchiveById(this._id);
      return this._$target.velocity({
        opacity: [1, 0]
      }, {
        duration: 500,
        easing: "linear",
        complete: (function(_this) {
          return function() {
            _this._$img.attr("src", "./data/" + _this._data.image);
            _this._$img.css({
              opacity: 0
            });
            return _this._$img.on("load", function() {
              return _this._$img.velocity({
                opacity: [1, 0]
              }, {
                duration: 500,
                easing: "linear"
              });
            });
          };
        })(this)
      });
    };

    return Item;

  })();
  Modal = (function() {
    function Modal(params) {
      this._$target = params.$target;
      this._getArchives = new modal.GetArchives({
        $target: $("#js-modalGetArchives")
      });
    }

    Modal.prototype.open = function(e) {
      if (e.id === ID_MODAL_GET_ARCHIVES) {
        return this._getArchives.open({
          success: e.data.success
        });
      }
    };

    return Modal;

  })();
  modal.GetArchives = (function() {
    function GetArchives(params) {
      this._onClosed = bind(this._onClosed, this);
      this._onOpened = bind(this._onOpened, this);
      this._$target = params.$target;
      this._$connect = $("#js-modalGetArchivesConnect");
      this._$failure = $("#js-modalGetArchivesFailure");
      this._$msg = $("#js-modalGetArchivesMsg");
      this._success = null;
      this._data = null;
      this._$target.on("shown.bs.modal", this._onOpened);
      this._$target.on("hidden.bs.modal", this._onClosed);
    }

    GetArchives.prototype.open = function(params) {
      this._success = params.success;
      this._toggleView({
        id: "connect"
      });
      return this._$target.modal({
        backdrop: "static",
        keyboard: false
      });
    };

    GetArchives.prototype._onOpened = function() {
      return $.ajax({
        url: "api/getArchives.php",
        type: "POST",
        dataType: "json",
        cache: false,
        timeout: 10000
      }).done((function(_this) {
        return function(data) {
          if (data.code === 0) {
            _this._data = data.data;
            return _this._$target.modal("hide");
          } else {
            _this._$msg.html(data.msg);
            return _this._toggleView({
              id: "failure"
            });
          }
        };
      })(this)).fail((function(_this) {
        return function() {
          _this._$msg.html("データの取得に失敗しました");
          return _this._toggleView({
            id: "failure"
          });
        };
      })(this));
    };

    GetArchives.prototype._onClosed = function() {
      if (this._success) {
        return this._success({
          data: this._data
        });
      }
    };

    GetArchives.prototype._toggleView = function(params) {
      if (params.id === "connect") {
        this._$connect.css({
          display: "block"
        });
        return this._$failure.css({
          display: "none"
        });
      } else if (params.id === "failure") {
        this._$connect.css({
          display: "none"
        });
        return this._$failure.velocity({
          opacity: [1, 0],
          translateY: [0, -50]
        }, {
          duration: 500,
          easing: "easeOutSine",
          display: "block"
        });
      }
    };

    return GetArchives;

  })();

  /*
  イベント
   */
  $body.on(EVENT_OPEN_MODAL, function(e, data) {
    return _modal.open({
      id: data.id,
      data: data.data || null
    });
  });

  /*
  アクション
   */
  values = new Values();
  _modal = new Modal({
    $target: $("#js-modal")
  });
  _archives = null;
  return $body.trigger(EVENT_OPEN_MODAL, [
    {
      id: ID_MODAL_GET_ARCHIVES,
      data: {
        success: (function(_this) {
          return function(params) {
            var data, hash;
            values.setArchives(params.data);
            hash = location.hash;
            if (hash) {
              hash = String(hash).replace("#", "");
              data = values.getArchiveById(hash);
              if (data) {
                $body.trigger(EVENT_OPEN_MODAL, [
                  {
                    id: ID_MODAL_DETAIL,
                    data: {
                      id: data.id
                    }
                  }
                ], false);
              }
            }
            return _archives = new Archives({
              $target: $("#js-archives")
            });
          };
        })(this)
      }
    }
  ], false);
});
