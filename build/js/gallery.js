var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(function() {
  var $body, $document, $html, $window, Archives, EVENT_OPEN_MODAL, ID_MODAL_DELETE, ID_MODAL_DETAIL, ID_MODAL_GET_ARCHIVES, LOAD_VOLUME, Modal, Values, _archives, _modal, archives, modal, values;
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
  ID_MODAL_DETAIL = "id_modal_detail";
  ID_MODAL_DELETE = "id_modal_delete";
  LOAD_VOLUME = 8;
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
      this._onClickLoad = bind(this._onClickLoad, this);
      this._$target = params.$target;
      this._$items = $("#js-archivesItems");
      this._$nav = $("#js-archivesNav");
      this._$btnLoad = $("#js-archivesBtnLoad");
      this._$item = this._$target.find(".js-archivesItem").clone();
      this._archives = values.getArchives();
      this._isComplete = false;
      this._intervalId = null;
      this._loadedItemCount = 0;
      this._$items.empty();
      this._setItem();
      this._$btnLoad.on("click", this._onClickLoad);
    }

    Archives.prototype._onClickLoad = function() {
      return this._setItem();
    };

    Archives.prototype._setItem = function() {
      var $item, data, i, item, items, j, k, len, len1, ref, totalDelay;
      items = [];
      ref = this._archives;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        data = ref[i];
        if (this._loadedItemCount <= i && i < this._loadedItemCount + LOAD_VOLUME) {
          $item = this._$item.clone();
          item = new archives.Item({
            $target: $item,
            id: data.id
          });
          items.push(item);
          this._$items.append($item);
        }
      }
      if (1 <= items.length) {
        this._loadedItemCount += LOAD_VOLUME;
        totalDelay = 0;
        for (i = k = 0, len1 = items.length; k < len1; i = ++k) {
          item = items[i];
          item.open({
            delay: i * 100
          });
          totalDelay += 100;
        }
        if (this._loadedItemCount <= this._archives.length) {
          if (this._intervalId) {
            clearTimeout;
          }
          return this._intervalId = setTimeout((function(_this) {
            return function() {
              return _this._$nav.css({
                display: "block"
              });
            };
          })(this), totalDelay + 1000);
        } else {
          return this._$nav.css({
            display: "none"
          });
        }
      }
    };

    return Archives;

  })();
  archives.Item = (function() {
    function Item(params) {
      this._onClickDetail = bind(this._onClickDetail, this);
      this._$target = params.$target;
      this._id = params.id;
      this._$thumb = this._$target.find(".js-archivesItemThumb");
      this._$img = this._$target.find(".js-archivesItemImg");
      this._$name = this._$target.find(".js-archivesItemName");
      this._$btnDetail = this._$target.find(".js-archivesItemBtnDetail");
      this._data = null;
      this._$target.attr("id", this._id);
    }

    Item.prototype.open = function(params) {
      this._data = values.getArchiveById(this._id);
      this._$name.text(decodeURIComponent(this._data.name));
      this._$target.css({
        display: "block"
      });
      this._$thumb.css({
        visibility: "hidden"
      });
      return this._$thumb.velocity({
        opacity: [1, 0],
        translateY: [0, 100],
        translateZ: [0, 100],
        rotateZ: [0, 10],
        rotateY: [0, 45]
      }, {
        duration: 1200,
        easing: "easeOutQuint",
        delay: params.delay,
        begin: (function(_this) {
          return function() {
            return _this._$thumb.css({
              visibility: "visible"
            });
          };
        })(this),
        complete: (function(_this) {
          return function() {
            _this._$img.attr("src", "./data/" + _this._data.image);
            _this._$img.css({
              opacity: 0
            });
            _this._$img.on("load", function() {
              return _this._$img.velocity({
                opacity: [1, 0]
              }, {
                duration: 500,
                easing: "linear"
              });
            });
            _this._$img.on("click", _this._onClickDetail);
            return _this._$btnDetail.on("click", _this._onClickDetail);
          };
        })(this)
      });
    };

    Item.prototype._onClickDetail = function(e) {
      e.preventDefault();
      return $body.trigger(EVENT_OPEN_MODAL, [
        {
          id: ID_MODAL_DETAIL,
          data: {
            id: this._id
          }
        }
      ], false);
    };

    return Item;

  })();
  Modal = (function() {
    function Modal(params) {
      this._$target = params.$target;
      this._getArchives = new modal.GetArchives({
        $target: $("#js-modalGetArchives")
      });
      this._detail = new modal.Detail({
        $target: $("#js-modalDetail")
      });
      this._delete = new modal.Delete({
        $target: $("#js-modalDelete")
      });
    }

    Modal.prototype.open = function(e) {
      if (e.id === ID_MODAL_GET_ARCHIVES) {
        return this._getArchives.open({
          success: e.data.success
        });
      } else if (e.id === ID_MODAL_DETAIL) {
        return this._detail.open({
          id: e.data.id
        });
      } else if (e.id === ID_MODAL_DELETE) {
        return this._delete.open({
          id: e.data.id,
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
  modal.Detail = (function() {
    function Detail(params) {
      this._onClickTw = bind(this._onClickTw, this);
      this._onClickDelete = bind(this._onClickDelete, this);
      this._$target = params.$target;
      this._$img = $("#js-modalDetailImg");
      this._$name = $("#js-modalDetailName");
      this._$msg = $("#js-modalDetailMsg");
      this._$date = $("#js-modalDetailDate");
      this._$btnTw = this._$target.find("#js-modalDetailBtnTw");
      this._$btnDelete = this._$target.find("#js-modalDetailBtnDelete");
      this._id = null;
      this._$btnTw.on("click", this._onClickTw);
      this._$btnDelete.on("click", this._onClickDelete);
    }

    Detail.prototype.open = function(params) {
      var data;
      if (!params.id) {
        return;
      }
      this._id = params.id;
      data = values.getArchiveById(this._id);
      if (!data) {
        return;
      }
      this._$img.attr("src", "./data/" + data.image);
      this._$name.html(decodeURIComponent(data.name));
      this._$msg.html(decodeURIComponent(data.message));
      this._$date.html(data.date);
      return this._$target.modal("show");
    };

    Detail.prototype._onClickDelete = function(e) {
      e.preventDefault();
      this._$target.modal("hide");
      return $body.trigger(EVENT_OPEN_MODAL, [
        {
          id: ID_MODAL_DELETE,
          data: {
            id: this._id
          }
        }
      ]);
    };

    Detail.prototype._onClickTw = function(e) {
      var data, href, message, name, tweet, url;
      e.preventDefault();
      data = values.getArchiveById(this._id);
      href = "https://twitter.com/intent/tweet";
      name = decodeURIComponent(data.name);
      name = "【" + name + "】";
      name = encodeURIComponent(name);
      message = decodeURIComponent(data.message);
      message = message.replace("<br>", "");
      if (50 < message.length) {
        message = message.substr(0, 50) + "...";
      }
      message = encodeURIComponent(message);
      url = String(location.href).split("#")[0] + "#" + this._id;
      url = encodeURIComponent(url);
      tweet = href + "?text=" + name + message + "&url=" + url;
      return window.open(tweet, "tweet_window", "width=640, height=300, menubar=no, toolbar=no, scrollbars=no, resizable=yes");
    };

    return Detail;

  })();
  modal.Delete = (function() {
    function Delete(params) {
      this._onClickDelete = bind(this._onClickDelete, this);
      this._$target = params.$target;
      this._$confirmation = $("#js-modalDeleteConfirmation");
      this._$connect = $("#js-modalDeleteConnect");
      this._$failure = $("#js-modalDeleteFailure");
      this._$success = $("#js-modalDeleteSuccess");
      this._$btnDelete = $("#js-modalDeleteBtnDelete");
      this._$msg = $("#js-modalDeleteMsg");
      this._$inputPw = $("#js-modalDeleteInputPw");
      this._$btnDelete.on("click", this._onClickDelete);
      this._$target.on("hidden.bs.modal", this._onClosed);
    }

    Delete.prototype.open = function(params) {
      this._id = params.id;
      this._toggleView({
        id: "confirmation"
      });
      return this._$target.modal({
        backdrop: "static",
        keyboard: false
      });
    };

    Delete.prototype._onClickDelete = function(e) {
      e.preventDefault();
      return this._toggleView({
        id: "connect",
        complete: (function(_this) {
          return function() {
            return $.ajax({
              url: "api/delete.php",
              type: "POST",
              dataType: "json",
              data: {
                pw: _this._$inputPw.val() || "0000",
                id: _this._id
              },
              cache: false,
              timeout: 10000
            }).done(function(data) {
              if (data.code === 0) {
                return _this._toggleView({
                  id: "success"
                });
              } else {
                _this._$msg.html(data.msg);
                return _this._toggleView({
                  id: "failure"
                });
              }
            }).fail(function() {
              _this._$msg.html("データの削除に失敗しました");
              return _this._toggleView({
                id: "failure"
              });
            });
          };
        })(this)
      });
    };

    Delete.prototype._toggleView = function(params) {
      var complete;
      complete = params.complete || null;
      if (params.id === "confirmation") {
        this._$confirmation.css({
          display: "block"
        });
        this._$connect.css({
          display: "none"
        });
        this._$failure.css({
          display: "none"
        });
        return this._$success.css({
          display: "none"
        });
      } else if (params.id === "connect") {
        this._$confirmation.css({
          display: "none"
        });
        this._$connect.velocity({
          opacity: [1, 0],
          translateY: [0, -50]
        }, {
          duration: 500,
          easing: "easeOutSine",
          display: "block",
          complete: (function(_this) {
            return function() {
              if (complete) {
                return complete();
              }
            };
          })(this)
        });
        this._$failure.css({
          display: "none"
        });
        return this._$success.css({
          display: "none"
        });
      } else if (params.id === "failure") {
        this._$confirmation.css({
          display: "none"
        });
        this._$connect.css({
          display: "none"
        });
        this._$failure.velocity({
          opacity: [1, 0],
          translateY: [0, -50]
        }, {
          duration: 500,
          easing: "easeOutSine",
          display: "block",
          complete: (function(_this) {
            return function() {
              if (complete) {
                return complete();
              }
            };
          })(this)
        });
        return this._$success.css({
          display: "none"
        });
      } else if (params.id === "success") {
        this._$confirmation.css({
          display: "none"
        });
        this._$connect.css({
          display: "none"
        });
        this._$failure.css({
          display: "none"
        });
        return this._$success.velocity({
          opacity: [1, 0],
          translateY: [0, -50]
        }, {
          duration: 500,
          easing: "easeOutSine",
          display: "block",
          complete: (function(_this) {
            return function() {
              if (complete) {
                return complete();
              }
            };
          })(this)
        });
      }
    };

    return Delete;

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
