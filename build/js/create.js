var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

$(function() {
  var $body, $html, $window, CANVAS_HEIGHT, CANVAS_WIDTH, Canvas, DEFAULT_STAMP_SRC, EVENT_ADD_HISTORY, EVENT_CHANGE_TOOL, EVENT_CLEAR, EVENT_DRAW_IMAGE, EVENT_OPEN_MODAL, EVENT_START_DRAG_AND_DROP, Header, ID_MODAL_DANGER, ID_MODAL_FILE, ID_MODAL_MSG, ID_MODAL_STAMP, ID_MODAL_UPLOAD, Modal, Tool, Values, _canvas, _header, _modal, _tool, canvas, modal, tool, values;
  $window = $(window);
  $html = $("html");
  $body = $("body");
  if (typeof canvas === "undefined" || canvas === null) {
    canvas = {};
  }
  if (typeof tool === "undefined" || tool === null) {
    tool = {};
  }
  if (tool.picture == null) {
    tool.picture = {};
  }
  if (typeof modal === "undefined" || modal === null) {
    modal = {};
  }

  /*
  定数
   */
  CANVAS_WIDTH = 260;
  CANVAS_HEIGHT = 260;
  DEFAULT_STAMP_SRC = "./images/stamp/stamp-00.png";
  ID_MODAL_FILE = "id_modal_file";
  ID_MODAL_DANGER = "id_modal_danger";
  ID_MODAL_STAMP = "id_modal_stamp";
  ID_MODAL_MSG = "id_modal_msg";
  ID_MODAL_UPLOAD = "id_modal_upload";
  EVENT_DRAW_IMAGE = "event_draw_image";
  EVENT_ADD_HISTORY = "event_add_history";
  EVENT_START_DRAG_AND_DROP = "event_start_drag_and_drop";
  EVENT_OPEN_MODAL = "event_open_modal";
  EVENT_CHANGE_TOOL = "event_change_tool";
  EVENT_CLEAR = "event_clear";

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
      this._isEdited = false;
      this._isEnabledPen = false;
      this._isEnabledStamp = false;
      this._penOpacity = 1;
      this._penThickness = 3;
      this._penColor = "#333333";
      this._stampImg = null;
      this._stampOpacity = 1;
      this._stampSize = 50;
      this._stampIsFlipHorizontal = false;
      this._stampIsFlipVertical = false;
    }

    Values.prototype.getIsPc = function() {
      return Boolean(this._isPC);
    };

    Values.prototype.setIsEdited = function(val) {
      if (val === "false" || val === false) {
        return this._isEdited = false;
      } else if (val === "true" || val === true) {
        return this._isEdited = true;
      }
    };

    Values.prototype.getIsEdited = function() {
      return Boolean(this._isEdited);
    };

    Values.prototype.setPenOpacity = function(val) {
      return this._penOpacity = Number(val);
    };

    Values.prototype.getPenOpacity = function() {
      return Number(this._penOpacity);
    };

    Values.prototype.setPenThickness = function(val) {
      return this._penThickness = Number(val);
    };

    Values.prototype.getPenThickness = function() {
      return Number(this._penThickness);
    };

    Values.prototype.setPenColor = function(val) {
      return this._penColor = String(val);
    };

    Values.prototype.getPenColor = function() {
      return String(this._penColor);
    };

    Values.prototype.setStampImg = function(val) {
      return this._stampImg = val;
    };

    Values.prototype.getStampImg = function() {
      return this._stampImg;
    };

    Values.prototype.setStampOpacity = function(val) {
      return this._stampOpacity = Number(val);
    };

    Values.prototype.getStampOpacity = function() {
      return Number(this._stampOpacity);
    };

    Values.prototype.setStampSize = function(val) {
      return this._stampSize = Number(val);
    };

    Values.prototype.getStampSize = function() {
      return Number(this._stampSize);
    };

    Values.prototype.setStampIsFlipHorizontal = function(val) {
      if (val === "false" || val === false) {
        return this._stampIsFlipHorizontal = false;
      } else if (val === "true" || val === true) {
        return this._stampIsFlipHorizontal = true;
      }
    };

    Values.prototype.getStampIsFlipHorizontal = function() {
      return Boolean(this._stampIsFlipHorizontal);
    };

    Values.prototype.setStampIsFlipVertical = function(val) {
      if (val === "false" || val === false) {
        return this._stampIsFlipVertical = false;
      } else if (val === "true" || val === true) {
        return this._stampIsFlipVertical = true;
      }
    };

    Values.prototype.getStampIsFlipVertical = function() {
      return Boolean(this._stampIsFlipVertical);
    };

    Values.prototype.setIsEnabledPen = function(val) {
      if (val === "false" || val === false) {
        return this._isEnabledPen = false;
      } else if (val === "true" || val === true) {
        return this._isEnabledPen = true;
      }
    };

    Values.prototype.getIsEnabledPen = function() {
      return Boolean(this._isEnabledPen);
    };

    Values.prototype.setIsEnabledStamp = function(val) {
      if (val === "false" || val === false) {
        return this._isEnabledStamp = false;
      } else if (val === "true" || val === true) {
        return this._isEnabledStamp = true;
      }
    };

    Values.prototype.getIsEnabledStamp = function() {
      return Boolean(this._isEnabledStamp);
    };

    return Values;

  })();
  Header = (function() {
    function Header(params) {
      this._onClickBtnSlideshow = bind(this._onClickBtnSlideshow, this);
      this._onClickBtnGallery = bind(this._onClickBtnGallery, this);
      this._onClickBtnCreate = bind(this._onClickBtnCreate, this);
      this._onClickBtnLogo = bind(this._onClickBtnLogo, this);
      this._$target = params.$target;
      this._$btnLogo = $("#js-headerBtnLogo");
      this._$btnCreate = $("#js-headerBtnCreate");
      this._$btnGallery = $("#js-headerBtnGallery");
      this._$btnSlideshow = $("#js-headerBtnSlideshow");
      this._$btnLogo.on("click", this._onClickBtnLogo);
      this._$btnCreate.on("click", this._onClickBtnCreate);
      this._$btnGallery.on("click", this._onClickBtnGallery);
      this._$btnSlideshow.on("click", this._onClickBtnSlideshow);
    }

    Header.prototype._onClickBtnLogo = function(e) {
      e.preventDefault();
      return this._changeLocation({
        msg: "Home",
        url: "./index.html"
      });
    };

    Header.prototype._onClickBtnCreate = function(e) {
      e.preventDefault();
      return this._changeLocation({
        msg: "Create",
        url: "./create.html"
      });
    };

    Header.prototype._onClickBtnGallery = function(e) {
      e.preventDefault();
      return this._changeLocation({
        msg: "Gallery",
        url: "./gallery.html"
      });
    };

    Header.prototype._onClickBtnSlideshow = function(e) {
      e.preventDefault();
      return this._changeLocation({
        msg: "Slideshow",
        url: "./slideshow.html"
      });
    };

    Header.prototype._changeLocation = function(params) {
      if (values.getIsEdited()) {
        return $body.trigger(EVENT_OPEN_MODAL, [
          {
            id: ID_MODAL_DANGER,
            data: {
              ttl: "Danger",
              msg: "&nbsp;" + params.msg + "ページに遷移する場合、現在編集中のカードは削除されますがよろしいですか？",
              agree: (function(_this) {
                return function() {
                  return location.href = params.url;
                };
              })(this)
            }
          }
        ]);
      } else {
        return location.href = params.url;
      }
    };

    return Header;

  })();
  Canvas = (function() {
    function Canvas(params) {
      this._onSaved = bind(this._onSaved, this);
      this._onClickOk = bind(this._onClickOk, this);
      this._onClickBack = bind(this._onClickBack, this);
      this._onClickClear = bind(this._onClickClear, this);
      this._$target = params.$target;
      this._$canvas = $("#js-canvasCanvas");
      this._$btnOk = $("#js-canvasBtnOk");
      this._$btnClear = $("#js-canvasBtnClear");
      this._$btnBack = $("#js-canvasBtnBack");
      this._context = this._$canvas.get(0).getContext("2d");
      if (values.getIsPc()) {
        this._pen = new canvas.PenPc({
          $canvas: this._$canvas,
          context: this._context
        });
        this._stamp = new canvas.StampPc({
          $canvas: this._$canvas,
          context: this._context
        });
      } else {
        this._pen = new canvas.PenSp({
          $canvas: this._$canvas,
          context: this._context
        });
        this._stamp = new canvas.StampSp({
          $canvas: this._$canvas,
          context: this._context
        });
      }
      this._imageDataArr = [];
      this._$btnClear.on("click", this._onClickClear);
      this._$btnBack.on("click", this._onClickBack);
      this._$btnOk.on("click", this._onClickOk);
    }

    Canvas.prototype.drawImage = function(params) {
      this._context.globalAlpha = params.opacity;
      return this._context.drawImage(params.target, params.x, params.y, params.width, params.height);
    };

    Canvas.prototype.addHistory = function() {
      this._imageDataArr.push(this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
      this._setBtnActivate();
      return values.setIsEdited(true);
    };

    Canvas.prototype.startDragAndDrop = function() {
      this._$canvas.get(0).addEventListener("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
        return e.dataTransfer.dropEffect = "copy";
      }, false);
      return this._$canvas.get(0).addEventListener("drop", (function(_this) {
        return function(e) {
          var reader;
          e.stopPropagation();
          e.preventDefault();
          reader = new FileReader();
          reader.readAsDataURL(e.dataTransfer.files[0]);
          return reader.onload = function() {
            var img;
            img = new Image();
            img.src = reader.result;
            return img.onload = function() {
              var height, width, x, y;
              if ((CANVAS_HEIGHT / img.height) < (CANVAS_WIDTH / img.width)) {
                width = CANVAS_WIDTH;
                height = CANVAS_WIDTH * (img.height / img.width);
                x = 0;
                y = -(height - CANVAS_HEIGHT) / 2;
              } else {
                width = CANVAS_HEIGHT * (img.width / img.height);
                height = CANVAS_HEIGHT;
                x = -(width - CANVAS_WIDTH) / 2;
                y = 0;
              }
              $body.trigger(EVENT_DRAW_IMAGE, [
                {
                  target: img,
                  x: x,
                  y: y,
                  width: width,
                  height: height
                }
              ]);
              return $body.trigger(EVENT_ADD_HISTORY);
            };
          };
        };
      })(this), false);
    };

    Canvas.prototype.changTool = function() {
      if (values.getIsEnabledPen()) {
        this._pen.setActive();
        return this._stamp.deleteActive();
      } else if (values.getIsEnabledStamp()) {
        this._pen.deleteActive();
        return this._stamp.setActive();
      } else {
        this._pen.deleteActive();
        return this._stamp.deleteActive();
      }
    };

    Canvas.prototype.clear = function() {
      this._imageDataArr = [];
      this._context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this._setBtnActivate();
      return values.setIsEdited(false);
    };

    Canvas.prototype._onClickClear = function() {
      return $body.trigger(EVENT_OPEN_MODAL, [
        {
          id: ID_MODAL_DANGER,
          data: {
            ttl: "Danger",
            msg: "&nbsp;カードを削除しますがよろしいですか？",
            agree: (function(_this) {
              return function() {
                return _this.clear();
              };
            })(this)
          }
        }
      ]);
    };

    Canvas.prototype._onClickBack = function() {
      var arr, i, imageData, k, len, ref;
      if (2 <= this._imageDataArr.length) {
        arr = [];
        ref = this._imageDataArr;
        for (i = k = 0, len = ref.length; k < len; i = ++k) {
          imageData = ref[i];
          if (i < this._imageDataArr.length - 1) {
            arr.push(imageData);
          }
        }
        this._imageDataArr = arr;
        this._context.putImageData(this._imageDataArr[this._imageDataArr.length - 1], 0, 0);
        return this._setBtnActivate();
      } else {
        return this.clear();
      }
    };

    Canvas.prototype._onClickOk = function() {
      return $body.trigger(EVENT_OPEN_MODAL, [
        {
          id: ID_MODAL_MSG,
          data: {
            src: this._$canvas.get(0).toDataURL(),
            save: (function(_this) {
              return function(e) {
                return _this._onSaved({
                  name: e.name,
                  msg: e.msg,
                  pw: e.pw
                });
              };
            })(this)
          }
        }
      ]);
    };

    Canvas.prototype._onSaved = function(params) {
      return $body.trigger(EVENT_OPEN_MODAL, [
        {
          id: ID_MODAL_UPLOAD,
          data: {
            src: this._$canvas.get(0).toDataURL(),
            name: params.name,
            msg: params.msg,
            pw: params.pw
          }
        }
      ]);
    };

    Canvas.prototype._setBtnActivate = function() {
      if (1 <= this._imageDataArr.length) {
        this._$btnOk.prop("disabled", false);
        this._$btnClear.prop("disabled", false);
        return this._$btnBack.prop("disabled", false);
      } else {
        this._$btnOk.prop("disabled", true);
        this._$btnClear.prop("disabled", true);
        return this._$btnBack.prop("disabled", true);
      }
    };

    return Canvas;

  })();
  canvas.PenPc = (function() {
    function PenPc(params) {
      this._onMouseLeave = bind(this._onMouseLeave, this);
      this._onMouseUp = bind(this._onMouseUp, this);
      this._onMouseMove = bind(this._onMouseMove, this);
      this._onMouseDown = bind(this._onMouseDown, this);
      this._onMouseEnter = bind(this._onMouseEnter, this);
      this._$canvas = params.$canvas;
      this._context = params.context;
      this._startX = null;
      this._startY = null;
      this._imageData = null;
      this._isDrawing = false;
    }

    PenPc.prototype.setActive = function() {
      this._$canvas.on("mouseenter", this._onMouseEnter);
      this._$canvas.on("mousedown", this._onMouseDown);
      this._$canvas.on("mousemove", this._onMouseMove);
      this._$canvas.on("mouseup", this._onMouseUp);
      return this._$canvas.on("mouseleave", this._onMouseLeave);
    };

    PenPc.prototype.deleteActive = function() {
      this._$canvas.off("mouseenter", this._onMouseEnter);
      this._$canvas.off("mousedown", this._onMouseDown);
      this._$canvas.off("mousemove", this._onMouseMove);
      this._$canvas.off("mouseup", this._onMouseUp);
      return this._$canvas.off("mouseleave", this._onMouseLeave);
    };

    PenPc.prototype._onMouseEnter = function(e) {
      e.preventDefault();
      this._context.lineCap = "round";
      this._context.lineJoin = "round";
      this._context.strokeStyle = values.getPenColor();
      this._context.lineWidth = values.getPenThickness();
      this._context.globalAlpha = values.getPenOpacity();
      this._startX = e.pageX - $(e.target).offset().left;
      this._startY = e.pageY - $(e.target).offset().top;
      this._imageData = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return this._onMouseMove(e);
    };

    PenPc.prototype._onMouseDown = function(e) {
      e.preventDefault();
      this._isDrawing = true;
      this._startX = e.pageX - $(e.target).offset().left;
      this._startY = e.pageY - $(e.target).offset().top;
      return this._onMouseMove(e);
    };

    PenPc.prototype._onMouseMove = function(e) {
      var x, y;
      e.preventDefault();
      if (!this._isDrawing) {
        if (this._imageData) {
          this._context.putImageData(this._imageData, 0, 0);
        }
      }
      x = e.pageX - $(e.target).offset().left;
      y = e.pageY - $(e.target).offset().top;
      this._context.beginPath();
      this._context.moveTo(this._startX, this._startY);
      this._context.lineTo(x + 0.1, y + 0.1);
      this._context.closePath();
      this._context.stroke();
      this._startX = x;
      this._startY = y;
      if (this._isDrawing) {
        return this._imageData = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    };

    PenPc.prototype._onMouseUp = function(e) {
      e.preventDefault();
      if (this._isDrawing) {
        $body.trigger(EVENT_ADD_HISTORY);
        return this._isDrawing = false;
      }
    };

    PenPc.prototype._onMouseLeave = function(e) {
      e.preventDefault();
      if (this._imageData) {
        this._context.putImageData(this._imageData, 0, 0);
        this._imageData = null;
      }
      if (this._isDrawing) {
        $body.trigger(EVENT_ADD_HISTORY);
        return this._isDrawing = false;
      }
    };

    return PenPc;

  })();
  canvas.PenSp = (function() {
    function PenSp(params) {
      this._onTouchEnd = bind(this._onTouchEnd, this);
      this._onTouchMove = bind(this._onTouchMove, this);
      this._onTouchStart = bind(this._onTouchStart, this);
      this._$canvas = params.$canvas;
      this._context = params.context;
      this._startX = null;
      this._startY = null;
    }

    PenSp.prototype.setActive = function() {
      this._$canvas.on("touchstart", this._onTouchStart);
      this._$canvas.on("touchmove", this._onTouchMove);
      return this._$canvas.on("touchend", this._onTouchEnd);
    };

    PenSp.prototype.deleteActive = function() {
      this._$canvas.off("touchstart", this._onTouchStart);
      this._$canvas.off("touchmove", this._onTouchMove);
      return this._$canvas.off("touchend", this._onTouchEnd);
    };

    PenSp.prototype._onTouchStart = function(e) {
      e.preventDefault();
      this._context.lineCap = "round";
      this._context.lineJoin = "round";
      this._context.strokeStyle = values.getPenColor();
      this._context.lineWidth = values.getPenThickness();
      this._context.globalAlpha = values.getPenOpacity();
      this._startX = e.originalEvent.touches[0].clientX - $(e.target).offset().left;
      this._startY = e.originalEvent.touches[0].clientY - $(e.target).offset().top + $window.scrollTop();
      return this._onTouchMove(e);
    };

    PenSp.prototype._onTouchMove = function(e) {
      var x, y;
      e.preventDefault();
      x = e.originalEvent.touches[0].clientX - $(e.target).offset().left;
      y = e.originalEvent.touches[0].clientY - $(e.target).offset().top + $window.scrollTop();
      this._context.beginPath();
      this._context.moveTo(this._startX, this._startY);
      this._context.lineTo(x + 0.1, y + 0.1);
      this._context.closePath();
      this._context.stroke();
      this._startX = x;
      return this._startY = y;
    };

    PenSp.prototype._onTouchEnd = function(e) {
      e.preventDefault();
      $body.trigger(EVENT_ADD_HISTORY);
      return this._isDrawing = false;
    };

    return PenSp;

  })();
  canvas.BaseStamp = (function() {
    function BaseStamp(params) {
      this._$canvas = params.$canvas;
      this._context = params.context;
      this._img = null;
      this._size = null;
      this._imageData = null;
    }

    BaseStamp.prototype._draw = function(x, y) {
      var isFlipHorizontal, isFlipVertical;
      this._context.save();
      isFlipHorizontal = values.getStampIsFlipHorizontal();
      isFlipVertical = values.getStampIsFlipVertical();
      if (isFlipHorizontal && !isFlipVertical) {
        this._context.scale(-1, 1);
        this._context.translate(-CANVAS_WIDTH, 0);
        x = CANVAS_WIDTH - x - this._size;
      } else if (!isFlipHorizontal && isFlipVertical) {
        this._context.scale(1, -1);
        this._context.translate(0, -CANVAS_HEIGHT);
        y = CANVAS_HEIGHT - y - this._size;
      } else if (isFlipHorizontal && isFlipVertical) {
        this._context.scale(-1, -1);
        this._context.translate(-CANVAS_WIDTH, -CANVAS_HEIGHT);
        x = CANVAS_WIDTH - x - this._size;
        y = CANVAS_HEIGHT - y - this._size;
      }
      $body.trigger(EVENT_DRAW_IMAGE, [
        {
          target: this._img,
          x: x,
          y: y,
          width: this._size,
          height: this._size,
          opacity: values.getStampOpacity()
        }
      ]);
      return this._context.restore();
    };

    return BaseStamp;

  })();
  canvas.StampPc = (function(superClass) {
    extend(StampPc, superClass);

    function StampPc(params) {
      this._onMouseLeave = bind(this._onMouseLeave, this);
      this._onMouseDown = bind(this._onMouseDown, this);
      this._onMouseMove = bind(this._onMouseMove, this);
      this._onMouseEnter = bind(this._onMouseEnter, this);
      StampPc.__super__.constructor.call(this, params);
    }

    StampPc.prototype.setActive = function() {
      this._$canvas.on("mouseenter", this._onMouseEnter);
      this._$canvas.on("mousedown", this._onMouseDown);
      this._$canvas.on("mousemove", this._onMouseMove);
      return this._$canvas.on("mouseleave", this._onMouseLeave);
    };

    StampPc.prototype.deleteActive = function() {
      this._$canvas.off("mouseenter", this._onMouseEnter);
      this._$canvas.off("mousedown", this._onMouseDown);
      this._$canvas.off("mousemove", this._onMouseMove);
      return this._$canvas.off("mouseleave", this._onMouseLeave);
    };

    StampPc.prototype._onMouseEnter = function(e) {
      e.preventDefault();
      this._img = values.getStampImg();
      this._size = values.getStampSize();
      this._imageData = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return this._onMouseMove(e);
    };

    StampPc.prototype._onMouseMove = function(e) {
      var x, y;
      e.preventDefault();
      x = e.pageX - $(e.target).offset().left - (this._size / 2);
      y = e.pageY - $(e.target).offset().top - (this._size / 2);
      if (this._imageData) {
        this._context.putImageData(this._imageData, 0, 0);
      }
      return this._draw(x, y);
    };

    StampPc.prototype._onMouseDown = function(e) {
      var x, y;
      e.preventDefault();
      if (this._imageData) {
        this._context.putImageData(this._imageData, 0, 0);
      }
      x = e.pageX - $(e.target).offset().left - (this._size / 2);
      y = e.pageY - $(e.target).offset().top - (this._size / 2);
      this._draw(x, y);
      this._imageData = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return $body.trigger(EVENT_ADD_HISTORY);
    };

    StampPc.prototype._onMouseLeave = function(e) {
      if (this._imageData) {
        return this._context.putImageData(this._imageData, 0, 0);
      }
    };

    return StampPc;

  })(canvas.BaseStamp);
  canvas.StampSp = (function(superClass) {
    extend(StampSp, superClass);

    function StampSp(params) {
      this._onTouchEnd = bind(this._onTouchEnd, this);
      this._onTouchMove = bind(this._onTouchMove, this);
      this._onTouchStart = bind(this._onTouchStart, this);
      StampSp.__super__.constructor.call(this, params);
      this._x = 0;
      this._y = 0;
      this._isEnter = false;
    }

    StampSp.prototype.setActive = function() {
      this._$canvas.on("touchstart", this._onTouchStart);
      this._$canvas.on("touchmove", this._onTouchMove);
      return this._$canvas.on("touchend", this._onTouchEnd);
    };

    StampSp.prototype.deleteActive = function() {
      this._$canvas.off("touchstart", this._onTouchStart);
      this._$canvas.off("touchmove", this._onTouchMove);
      return this._$canvas.off("touchend", this._onTouchEnd);
    };

    StampSp.prototype._onTouchStart = function(e) {
      e.preventDefault();
      this._img = values.getStampImg();
      this._size = values.getStampSize();
      this._imageData = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return this._onTouchMove(e);
    };

    StampSp.prototype._onTouchMove = function(e) {
      var clientX, clientY, left, top;
      e.preventDefault();
      clientX = e.originalEvent.touches[0].clientX;
      clientY = e.originalEvent.touches[0].clientY + $window.scrollTop();
      top = $(e.target).offset().top;
      left = $(e.target).offset().left;
      if (this._imageData) {
        this._context.putImageData(this._imageData, 0, 0);
      }
      if (clientX - left < 0 || CANVAS_WIDTH < clientX - left) {
        this._isEnter = false;
        return;
      }
      if (clientY - top < 0 || CANVAS_HEIGHT < clientY - top) {
        this._isEnter = false;
        return;
      }
      this._isEnter = true;
      this._x = clientX - left - (this._size / 2);
      this._y = clientY - top - (this._size / 2);
      return this._draw(this._x, this._y);
    };

    StampSp.prototype._onTouchEnd = function(e) {
      e.preventDefault();
      if (!this._isEnter) {
        return;
      }
      if (this._imageData) {
        this._context.putImageData(this._imageData, 0, 0);
      }
      this._draw(this._x, this._y);
      return $body.trigger(EVENT_ADD_HISTORY);
    };

    return StampSp;

  })(canvas.BaseStamp);
  Tool = (function() {
    function Tool(params) {
      this._$target = params.$target;
      this._$tabPicture = $("#js-toolTabPicture");
      this._$tabPen = $("#js-toolTabPen");
      this._$tabStamp = $("#js-toolTabStamp");
      this._picture = new tool.Picture({
        $target: $("#js-toolPicture")
      });
      this._pen = new tool.Pen({
        $target: $("#js-toolPen")
      });
      this._stamp = new tool.Stamp({
        $target: $("#js-toolStamp")
      });
      this._$tabPicture.on("shown.bs.tab", (function(_this) {
        return function(e) {
          return _this._onChangeTab({
            id: "picture"
          });
        };
      })(this));
      this._$tabPen.on("shown.bs.tab", (function(_this) {
        return function(e) {
          return _this._onChangeTab({
            id: "pen"
          });
        };
      })(this));
      this._$tabStamp.on("shown.bs.tab", (function(_this) {
        return function(e) {
          return _this._onChangeTab({
            id: "stamp"
          });
        };
      })(this));
      $body.trigger(EVENT_CHANGE_TOOL);
    }

    Tool.prototype._onChangeTab = function(e) {
      if (e.id === "picture") {
        values.setIsEnabledPen(false);
        values.setIsEnabledStamp(false);
      } else if (e.id === "pen") {
        values.setIsEnabledPen(true);
        values.setIsEnabledStamp(false);
      } else if (e.id === "stamp") {
        values.setIsEnabledPen(false);
        values.setIsEnabledStamp(true);
      }
      return $body.trigger(EVENT_CHANGE_TOOL);
    };

    return Tool;

  })();
  tool.Picture = (function() {
    function Picture(params) {
      this._$target = params.$target;
      this._file = new tool.picture.File({
        $target: $("#js-toolPictureFile")
      });
      this._camera = new tool.picture.Camera({
        $target: $("#js-toolPictureCamera")
      });
      this._dragAndDrop = new tool.picture.DragAndDrop({
        $target: $("#js-toolPictureDragAndDrop")
      });
    }

    return Picture;

  })();
  tool.picture.File = (function() {
    function File(params) {
      this._onChange = bind(this._onChange, this);
      this._$target = params.$target;
      if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        this._$target.css({
          display: "none"
        });
        return;
      }
      this._$inputFile = $("#js-toolPictureFileInputFile");
      this._$inputFile.on("change", this._onChange);
    }

    File.prototype._onChange = function(e) {
      var file, reader;
      if (values.getIsPc()) {
        file = e.target.files[0];
        reader = new FileReader();
        reader.readAsDataURL(file);
        return reader.onload = (function(_this) {
          return function(e) {
            return $body.trigger(EVENT_OPEN_MODAL, [
              {
                id: ID_MODAL_FILE,
                data: {
                  src: reader.result
                }
              }
            ], false);
          };
        })(this);
      } else {
        return loadImage(e.target.files[0], (function(_this) {
          return function(img) {
            return $body.trigger(EVENT_OPEN_MODAL, [
              {
                id: ID_MODAL_FILE,
                data: {
                  img: img
                }
              }
            ], false);
          };
        })(this), {
          maxWidth: CANVAS_WIDTH * 2,
          maxHeight: CANVAS_HEIGHT * 2,
          minWidth: CANVAS_WIDTH,
          minHeight: CANVAS_HEIGHT,
          canvas: true,
          orientation: 6
        });
      }
    };

    return File;

  })();
  tool.picture.Camera = (function() {
    function Camera(params) {
      this._onClickStop = bind(this._onClickStop, this);
      this._onClickCapture = bind(this._onClickCapture, this);
      this._onClickPlay = bind(this._onClickPlay, this);
      this._$target = params.$target;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || null;
      if (!navigator.getUserMedia) {
        this._$target.css({
          display: "none"
        });
        return;
      }
      this._$video = $("#js-toolPictureCameraVideo");
      this._$btnPlay = $("#js-toolPictureCameraBtnPlay");
      this._$btnStop = $("#js-toolPictureCameraBtnStop");
      this._$btnStop2 = $("#js-toolPictureCameraBtnStop2");
      this._$btnCapture = $("#js-toolPictureCameraBtnCapture");
      this._localMediaStream = null;
      this._isPlay = false;
      this._$btnStop.css({
        display: "block"
      });
      this._$btnCapture.css({
        display: "block"
      });
      this._$btnPlay.on("click", this._onClickPlay);
      this._$btnCapture.on("click", this._onClickCapture);
      this._$btnStop.on("click", this._onClickStop);
      this._$btnStop2.on("click", this._onClickStop);
    }

    Camera.prototype._onClickPlay = function() {
      var flg;
      this._toggleView();
      flg = false;
      return $("html, body").animate({
        scrollTop: 1
      }, 500, "swing", (function(_this) {
        return function() {
          if (!flg) {
            flg = true;
            return;
          }
          window.URL = window.URL || window.webkitURL;
          return navigator.getUserMedia({
            video: true
          }, function(stream) {
            _this._$video.get(0).src = window.URL.createObjectURL(stream);
            _this._$video.get(0).play();
            return _this._localMediaStream = stream;
          }, function(e) {
            return console.log("Error : " + e);
          });
        };
      })(this));
    };

    Camera.prototype._onClickCapture = function() {
      this._toggleView();
      $body.trigger(EVENT_DRAW_IMAGE, [
        {
          target: this._$video.get(0),
          x: -43,
          y: 0,
          width: 346,
          height: CANVAS_HEIGHT
        }
      ]);
      $body.trigger(EVENT_ADD_HISTORY);
      if (this._localMediaStream) {
        this._localMediaStream.stop();
        return this._localMediaStream = null;
      }
    };

    Camera.prototype._onClickStop = function() {
      this._toggleView();
      if (this._localMediaStream) {
        this._localMediaStream.stop();
        return this._localMediaStream = null;
      }
    };

    Camera.prototype._toggleView = function() {
      if (this._isPlay) {
        this._$video.css({
          display: "none"
        });
        this._$btnCapture.prop("disabled", true);
        this._$btnPlay.css({
          display: "block"
        });
        this._$btnStop.prop("disabled", true);
        this._$btnStop2.css({
          display: "none"
        });
      } else {
        this._$video.css({
          display: "block"
        });
        this._$btnCapture.prop("disabled", false);
        this._$btnPlay.css({
          display: "none"
        });
        this._$btnStop.prop("disabled", false);
        this._$btnStop2.css({
          display: "block"
        });
      }
      return this._isPlay = !this._isPlay;
    };

    return Camera;

  })();
  tool.picture.DragAndDrop = (function() {
    function DragAndDrop(params) {
      this._$target = params.$target;
      if (!values.getIsPc()) {
        this._$target.css({
          display: "none"
        });
        return;
      }
      $body.trigger(EVENT_START_DRAG_AND_DROP);
    }

    return DragAndDrop;

  })();
  tool.Pen = (function() {
    function Pen(params) {
      this._$target = params.$target;
      this._$preview = $("#js-toolPenPreview");
      this._$canvas = $("#js-toolPenCanvas");
      this._context = this._$canvas.get(0).getContext("2d");
      this._canvasSize = 0;
      this._changeOpacity({
        val: $("#js-toolPenOpacity").find(":selected").val()
      });
      this._changeThickness({
        val: $("input[name=js-toolPenThickness]:checked").val()
      });
      this._changeColor({
        val: $("input[name=js-toolPenColor]:checked").val()
      });
      this._setPreview();
      $("#js-toolPenOpacity").on("change", (function(_this) {
        return function(e) {
          _this._changeOpacity({
            val: $(e.target).val()
          });
          return _this._setPreview();
        };
      })(this));
      $("input[name=js-toolPenThickness]").on("change", (function(_this) {
        return function(e) {
          _this._changeThickness({
            val: $(e.target).val()
          });
          return _this._setPreview();
        };
      })(this));
      $("input[name=js-toolPenColor]").on("change", (function(_this) {
        return function(e) {
          _this._changeColor({
            val: $(e.target).val()
          });
          return _this._setPreview();
        };
      })(this));
    }

    Pen.prototype._changeOpacity = function(params) {
      return values.setPenOpacity(Number(params.val));
    };

    Pen.prototype._changeThickness = function(params) {
      var thickness;
      thickness = Number(params.val);
      this._canvasSize = thickness;
      if (this._canvasSize < 60) {
        this._canvasSize = 60;
      }
      this._$preview.css({
        width: this._canvasSize + 32
      });
      this._$canvas.css({
        width: this._canvasSize,
        height: this._canvasSize
      });
      return values.setPenThickness(thickness);
    };

    Pen.prototype._changeColor = function(params) {
      return values.setPenColor(String(params.val));
    };

    Pen.prototype._setPreview = function() {
      var x, y;
      this._context.clearRect(0, 0, this._canvasSize, this._canvasSize);
      x = this._canvasSize / 2;
      y = this._canvasSize / 2;
      this._context.save();
      this._context.globalAlpha = values.getPenOpacity();
      this._context.lineCap = "round";
      this._context.lineJoin = "round";
      this._context.strokeStyle = values.getPenColor();
      this._context.lineWidth = values.getPenThickness();
      this._context.beginPath();
      this._context.moveTo(x, y);
      this._context.lineTo(x + 0.1, y + 0.1);
      this._context.closePath();
      this._context.stroke();
      return this._context.restore();
    };

    return Pen;

  })();
  tool.Stamp = (function() {
    function Stamp(params) {
      this._openStampModal = bind(this._openStampModal, this);
      this._$target = params.$target;
      this._$preview = $("#js-toolStampPreview");
      this._$canvas = $("#js-toolStampCanvas");
      this._$btnType = $("#js-toolStampBtnType");
      this._context = this._$canvas.get(0).getContext("2d");
      this._canvasSize = 0;
      this._changeOpacity({
        val: $("#js-toolStampOpacity").find(":selected").val()
      });
      this._changeSize({
        val: $("#js-toolStampSize").find(":selected").val()
      });
      this._changeFlip();
      $("<img>").attr("src", DEFAULT_STAMP_SRC).on("load", (function(_this) {
        return function(e) {
          _this._changeType({
            img: e.target
          });
          return _this._setPreview();
        };
      })(this));
      this._$btnType.on("click", this._openStampModal);
      $("#js-toolStampOpacity").on("change", (function(_this) {
        return function(e) {
          _this._changeOpacity({
            val: $(e.target).val()
          });
          return _this._setPreview();
        };
      })(this));
      $("#js-toolStampSize").on("change", (function(_this) {
        return function(e) {
          _this._changeSize({
            val: $(e.target).val()
          });
          return _this._setPreview();
        };
      })(this));
      $("input[name=js-toolStampFlip]").on("change", (function(_this) {
        return function() {
          _this._changeFlip();
          return _this._setPreview();
        };
      })(this));
    }

    Stamp.prototype._openStampModal = function() {
      return $body.trigger(EVENT_OPEN_MODAL, [
        {
          id: ID_MODAL_STAMP,
          data: {
            select: (function(_this) {
              return function(e) {
                _this._changeType({
                  img: e.img
                });
                return _this._setPreview();
              };
            })(this)
          }
        }
      ]);
    };

    Stamp.prototype._changeFlip = function() {
      var isFlipHorizontal, isFlipVertical;
      isFlipHorizontal = false;
      isFlipVertical = false;
      $("input[name=js-toolStampFlip]:checked").each((function(_this) {
        return function(i, element) {
          if ($(element).val() === "horizontal") {
            isFlipHorizontal = true;
          }
          if ($(element).val() === "vertical") {
            return isFlipVertical = true;
          }
        };
      })(this));
      values.setStampIsFlipHorizontal(isFlipHorizontal);
      return values.setStampIsFlipVertical(isFlipVertical);
    };

    Stamp.prototype._changeOpacity = function(params) {
      return values.setStampOpacity(Number(params.val));
    };

    Stamp.prototype._changeSize = function(params) {
      this._canvasSize = Number(params.val);
      if (this._canvasSize < 70) {
        this._canvasSize = 70;
      }
      this._$preview.css({
        width: this._canvasSize + 32
      });
      this._$canvas.attr("width", this._canvasSize);
      this._$canvas.attr("height", this._canvasSize);
      return values.setStampSize(Number(params.val));
    };

    Stamp.prototype._changeType = function(params) {
      if (params.img) {
        return values.setStampImg(params.img);
      }
    };

    Stamp.prototype._setPreview = function() {
      var img, isFlipHorizontal, isFlipVertical, size, x, y;
      isFlipHorizontal = values.getStampIsFlipHorizontal();
      isFlipVertical = values.getStampIsFlipVertical();
      img = values.getStampImg();
      size = values.getStampSize();
      x = 0;
      y = 0;
      if (size < this._canvasSize) {
        x = (this._canvasSize - size) / 2;
        y = (this._canvasSize - size) / 2;
      }
      this._context.save();
      this._context.clearRect(0, 0, this._canvasSize, this._canvasSize);
      if (isFlipHorizontal && !isFlipVertical) {
        this._context.scale(-1, 1);
        this._context.translate(-this._canvasSize, 0);
      } else if (!isFlipHorizontal && isFlipVertical) {
        this._context.scale(1, -1);
        this._context.translate(0, -this._canvasSize);
      } else if (isFlipHorizontal && isFlipVertical) {
        this._context.scale(-1, -1);
        this._context.translate(-this._canvasSize, -this._canvasSize);
      }
      this._context.globalAlpha = values.getStampOpacity();
      this._context.drawImage(img, x, y, size, size);
      return this._context.restore();
    };

    return Stamp;

  })();
  Modal = (function() {
    function Modal(params) {
      this._$target = params.$target;
      this._file = new modal.File({
        $target: $("#js-modalFile")
      });
      this._stamp = new modal.Stamp({
        $target: $("#js-modalStamp")
      });
      this._danger = new modal.Danger({
        $target: $("#js-modalDanger")
      });
      this._msg = new modal.Msg({
        $target: $("#js-modalMsg")
      });
      this._upload = new modal.Upload({
        $target: $("#js-modalUpload")
      });
    }

    Modal.prototype.open = function(e) {
      if (e.id === ID_MODAL_FILE) {
        return this._file.open({
          src: e.data.src || null,
          img: e.data.img || null
        });
      } else if (e.id === ID_MODAL_STAMP) {
        return this._stamp.open({
          select: e.data.select,
          cancel: e.data.cancel
        });
      } else if (e.id === ID_MODAL_DANGER) {
        return this._danger.open({
          ttl: e.data.ttl,
          msg: e.data.msg,
          agree: e.data.agree,
          cancel: e.data.cancel
        });
      } else if (e.id === ID_MODAL_MSG) {
        return this._msg.open({
          src: e.data.src,
          save: e.data.save
        });
      } else if (e.id === ID_MODAL_UPLOAD) {
        return this._upload.open({
          src: e.data.src,
          name: e.data.name,
          msg: e.data.msg,
          pw: e.data.pw
        });
      }
    };

    return Modal;

  })();
  modal.Stamp = (function() {
    function Stamp(params) {
      this._onSelect = bind(this._onSelect, this);
      this._onOpened = bind(this._onOpened, this);
      this._$target = params.$target;
      this._select = null;
      this._$target.on("shown.bs.modal", this._onOpened);
    }

    Stamp.prototype.open = function(params) {
      this._select = params.select || null;
      return this._$target.modal({
        remote: "./modal-stamp.html"
      });
    };

    Stamp.prototype._onOpened = function() {
      return $("input[name=js-toolStampType]").on("change", this._onSelect);
    };

    Stamp.prototype._onSelect = function(e) {
      var $img;
      $img = $("img");
      $img.attr("src", $(e.target).val());
      return $img.on("load", (function(_this) {
        return function() {
          if (_this._select) {
            _this._select({
              img: $img.get(0)
            });
          }
          return _this._$target.modal("hide");
        };
      })(this));
    };

    return Stamp;

  })();
  modal.Danger = (function() {
    function Danger(params) {
      this._onClose = bind(this._onClose, this);
      this._onCickCancel = bind(this._onCickCancel, this);
      this._onClickAgree = bind(this._onClickAgree, this);
      this._$target = params.$target;
      this._$ttl = $("#js-modalDangerTtl");
      this._$txt = $("#js-modalDangerTxt");
      this._$btnCancel = $("#js-modalDangerBtnCancel");
      this._$btnAgree = $("#js-modalDangerBtnAgree");
      this._cancel = null;
      this._agree = null;
      this._$btnAgree.on("click", this._onClickAgree);
      this._$btnCancel.on("click", this._onCickCancel);
    }

    Danger.prototype.open = function(params) {
      this._agree = params.agree || null;
      this._cancel = params.cancel || null;
      this._$ttl.html(params.ttl);
      this._$txt.html(params.msg);
      this._$target.on("hidden.bs.modal", this._onClose);
      return this._$target.modal("show");
    };

    Danger.prototype._onClickAgree = function() {
      if (this._agree) {
        this._agree();
      }
      this._$target.off("hidden.bs.modal", this._onClose);
      return this._$target.modal("hide");
    };

    Danger.prototype._onCickCancel = function() {
      if (this._cancel) {
        this._cancel();
      }
      this._$target.off("hidden.bs.modal", this._onClose);
      return this._$target.modal("hide");
    };

    Danger.prototype._onClose = function() {
      this._$target.modal("hide");
      if (this._cancel) {
        return this._cancel();
      }
    };

    return Danger;

  })();
  modal.File = (function() {
    function File(params) {
      this._onClose = bind(this._onClose, this);
      this._onClickDecide = bind(this._onClickDecide, this);
      this._onClickRotate = bind(this._onClickRotate, this);
      this._$target = params.$target;
      this._$btnRotate = $("#js-modalFileBtnRotate");
      this._$btnDecide = $("#js-modalFileBtnDecide");
      this._$canvas = $("#js-modalFileCanvas");
      this._context = this._$canvas.get(0).getContext("2d");
      this._img = null;
      this._src = null;
      this._$target.on("hidden.bs.modal", this._onClose);
      this._$btnRotate.on("click", this._onClickRotate);
      this._$btnDecide.on("click", this._onClickDecide);
    }

    File.prototype.open = function(params) {
      var height, width, x, y;
      if (params.img) {
        this._img = params.img;
        if ((CANVAS_HEIGHT / this._img.height) < (CANVAS_WIDTH / this._img.width)) {
          width = CANVAS_WIDTH;
          height = CANVAS_WIDTH * (this._img.height / this._img.width);
          x = 0;
          y = -(height - CANVAS_HEIGHT) / 2;
        } else {
          width = CANVAS_HEIGHT * (this._img.width / this._img.height);
          height = CANVAS_HEIGHT;
          x = -(width - CANVAS_WIDTH) / 2;
          y = 0;
        }
        this._context.drawImage(this._img, x, y, width, height);
        this._$target.modal("show");
      }
      if (params.src) {
        this._src = params.src;
        this._img = new Image();
        this._img.src = this._src;
        return this._img.onload = (function(_this) {
          return function() {
            if ((CANVAS_HEIGHT / _this._img.height) < (CANVAS_WIDTH / _this._img.width)) {
              width = CANVAS_WIDTH;
              height = CANVAS_WIDTH * (_this._img.height / _this._img.width);
              x = 0;
              y = -(height - CANVAS_HEIGHT) / 2;
            } else {
              width = CANVAS_HEIGHT * (_this._img.width / _this._img.height);
              height = CANVAS_HEIGHT;
              x = -(width - CANVAS_WIDTH) / 2;
              y = 0;
            }
            _this._context.drawImage(_this._img, x, y, width, height);
            return _this._$target.modal("show");
          };
        })(this);
      }
    };

    File.prototype._onClickRotate = function() {
      var a, b, data, g, h, i, imagedata, j, k, l, m, n, r, ref, ref1, ref2, ref3, ref4, s, t, w, x, y;
      imagedata = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      data = imagedata.data;
      w = CANVAS_WIDTH;
      h = CANVAS_HEIGHT;
      for (i = k = 0, ref = h; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        y = i * w;
        for (j = l = ref1 = i, ref2 = w; ref1 <= ref2 ? l <= ref2 : l >= ref2; j = ref1 <= ref2 ? ++l : --l) {
          s = (y + j) * 4;
          t = (j * w + i) * 4;
          r = data[s];
          g = data[s + 1];
          b = data[s + 2];
          a = data[s + 3];
          data[s] = data[t];
          data[s + 1] = data[t + 1];
          data[s + 2] = data[t + 2];
          data[s + 3] = data[t + 3];
          data[t] = r;
          data[t + 1] = g;
          data[t + 2] = b;
          data[t + 3] = a;
        }
      }
      for (i = m = 0, ref3 = h; 0 <= ref3 ? m <= ref3 : m >= ref3; i = 0 <= ref3 ? ++m : --m) {
        y = i * w;
        x = y + w;
        for (j = n = 0, ref4 = w / 2; 0 <= ref4 ? n <= ref4 : n >= ref4; j = 0 <= ref4 ? ++n : --n) {
          s = (y + j) * 4;
          t = (x - j) * 4;
          r = data[s];
          g = data[s + 1];
          b = data[s + 2];
          a = data[s + 3];
          data[s] = data[t];
          data[s + 1] = data[t + 1];
          data[s + 2] = data[t + 2];
          data[s + 3] = data[t + 3];
          data[t] = r;
          data[t + 1] = g;
          data[t + 2] = b;
          data[t + 3] = a;
        }
      }
      this._context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return this._context.putImageData(imagedata, 0, 0);
    };

    File.prototype._onClickDecide = function() {
      $body.trigger(EVENT_DRAW_IMAGE, [
        {
          target: this._$canvas.get(0),
          x: 0,
          y: 0,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT
        }
      ]);
      $body.trigger(EVENT_ADD_HISTORY);
      return this._$target.modal("hide");
    };

    File.prototype._onClose = function() {
      this._src = null;
      this._img = null;
      return this._context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    return File;

  })();
  modal.Msg = (function() {
    function Msg(params) {
      this._onClose = bind(this._onClose, this);
      this._onSave = bind(this._onSave, this);
      this._onChangeForm = bind(this._onChangeForm, this);
      this._startClose = bind(this._startClose, this);
      this._completeOpen = bind(this._completeOpen, this);
      this._$target = params.$target;
      this._$img = $("#js-modalMsgImg");
      this._$inputName = $("#js-modalMsgInputName");
      this._$textareaMsg = $("#js-modalMsgTextareaMsg");
      this._$inputPw = $("#js-modalMsgInputPw");
      this._$btnSave = $("#js-modalMsgBtnSave");
      this._save = null;
      this._$target.on("shown.bs.modal", this._completeOpen);
      this._$target.on("hide.bs.modal", this._startClose);
      this._$target.on("hidden.bs.modal", this._onClose);
      this._$btnSave.on("click", this._onSave);
    }

    Msg.prototype.open = function(params) {
      var src;
      src = params.src;
      this._save = params.save;
      this._$inputName.on("keydown keyup keypress change", this._onChangeForm);
      this._$textareaMsg.on("keydown keyup keypress change", this._onChangeForm);
      this._$inputPw.on("keydown keyup keypress change", this._onChangeForm);
      this._$inputName.val(null);
      this._$textareaMsg.val(null);
      this._$inputPw.val(null);
      this._$btnSave.prop("disabled", true);
      if (src) {
        this._$img.attr("src", src);
      }
      return this._$target.modal("show");
    };

    Msg.prototype._completeOpen = function() {
      $("#js-tool").css({
        display: "none"
      });
      return $("#js-info").css({
        display: "none"
      });
    };

    Msg.prototype._startClose = function() {
      $("#js-tool").css({
        display: "block"
      });
      return $("#js-info").css({
        display: "block"
      });
    };

    Msg.prototype._onChangeForm = function() {
      var msg, name;
      name = this._$inputName.val();
      msg = this._$textareaMsg.val();
      if (!name || !msg) {
        return this._$btnSave.prop("disabled", true);
      } else {
        return this._$btnSave.prop("disabled", false);
      }
    };

    Msg.prototype._onSave = function() {
      var msg, name, pw;
      name = this._$inputName.val();
      msg = this._$textareaMsg.val().replace(/\r?\n/g, '<br>');
      pw = this._$inputPw.val();
      if (!pw) {
        pw = "0000";
      }
      if (this._save) {
        this._save({
          name: name,
          msg: msg,
          pw: pw
        });
      }
      return this._$target.modal("hide");
    };

    Msg.prototype._onClose = function() {
      this._$img.attr("src", "");
      this._$inputName.off("keydown keyup keypress change", this._onChangeForm);
      this._$textareaMsg.off("keydown keyup keypress change", this._onChangeForm);
      return this._$inputPw.off("keydown keyup keypress change", this._onChangeForm);
    };

    return Msg;

  })();
  modal.Upload = (function() {
    function Upload(params) {
      this._onClickCreateAgain = bind(this._onClickCreateAgain, this);
      this._onClickToGallery = bind(this._onClickToGallery, this);
      this._onOpened = bind(this._onOpened, this);
      this._$target = params.$target;
      this._$contentSending = $("#js-modalUploadContentSending");
      this._$contentComplete = $("#js-modalUploadContentComplete");
      this._$contentError = $("#js-modalUploadContentError");
      this._$btnToGallery = $("#js-modalUploadBtnToGallery");
      this._$btnCreateAgain = $("#js-modalUploadBtnCreateAgain");
      this._id = null;
      this._pw = null;
      this._src = null;
      this._name = null;
      this._msg = null;
      this._$target.on("shown.bs.modal", this._onOpened);
      this._$btnToGallery.on("click", this._onClickToGallery);
      this._$btnCreateAgain.on("click", this._onClickCreateAgain);
    }

    Upload.prototype.open = function(params) {
      this._id = null;
      this._src = params.src;
      this._name = params.name;
      this._msg = params.msg;
      this._pw = params.pw;
      this._toggleView({
        id: "sending"
      });
      return this._$target.modal({
        backdrop: "static",
        keyboard: false
      });
    };

    Upload.prototype._onOpened = function() {
      var image;
      image = this._src;
      image = image.replace(/^data:image\/png;base64,/, "");
      return $.ajax({
        url: "api/upload.php",
        type: "POST",
        data: {
          pw: this._pw,
          image: image,
          name: encodeURIComponent(this._name),
          message: encodeURIComponent(this._msg)
        },
        dataType: "json",
        cache: false,
        timeout: 10000
      }).done((function(_this) {
        return function(data) {
          _this._toggleView({
            id: "complete"
          });
          return _this._id = data.id;
        };
      })(this)).fail((function(_this) {
        return function(data) {
          return _this._toggleView({
            id: "error"
          });
        };
      })(this));
    };

    Upload.prototype._onClickToGallery = function() {
      if (this._id) {
        return location.href = "./gallery.html#" + this._id;
      } else {
        return location.href = "./gallery.html";
      }
    };

    Upload.prototype._onClickCreateAgain = function() {
      this._$target.modal("hide");
      return $body.trigger(EVENT_CLEAR);
    };

    Upload.prototype._toggleView = function(params) {
      if (params.id === "sending") {
        this._$contentSending.css({
          display: "block"
        });
        this._$contentComplete.css({
          display: "none"
        });
        return this._$contentError.css({
          display: "none"
        });
      } else if (params.id === "complete") {
        this._$contentSending.css({
          display: "none"
        });
        this._$contentComplete.velocity({
          opacity: [1, 0],
          translateY: [0, -50]
        }, {
          duration: 500,
          easing: "easeOutSine",
          display: "block"
        });
        return this._$contentError.css({
          display: "none"
        });
      } else if (params.id === "error") {
        this._$contentSending.css({
          display: "none"
        });
        this._$contentComplete.css({
          display: "none"
        });
        return this._$contentError.velocity({
          opacity: [1, 0],
          translateY: [0, -50]
        }, {
          duration: 500,
          easing: "easeOutSine",
          display: "block"
        });
      }
    };

    return Upload;

  })();

  /*
  イベント
   */
  $body.on(EVENT_DRAW_IMAGE, function(e, data) {
    return _canvas.drawImage({
      target: data.target,
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      opacity: data.opacity || 1
    });
  });
  $body.on(EVENT_ADD_HISTORY, function() {
    return _canvas.addHistory();
  });
  $body.on(EVENT_START_DRAG_AND_DROP, function() {
    return _canvas.startDragAndDrop();
  });
  $body.on(EVENT_OPEN_MODAL, function(e, data) {
    return _modal.open({
      id: data.id,
      data: data.data || null
    });
  });
  $body.on(EVENT_CHANGE_TOOL, function() {
    return _canvas.changTool();
  });
  $body.on(EVENT_CLEAR, function() {
    return _canvas.clear();
  });

  /*
  アクション
   */
  values = new Values();
  _header = new Header({
    $target: $("#js-header")
  });
  _canvas = new Canvas({
    $target: $("#js-canvas")
  });
  _tool = new Tool({
    $target: $("#js-tool")
  });
  return _modal = new Modal({
    $target: $("#js-modal")
  });
});
