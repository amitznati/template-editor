import { helper } from '../Helper';

import {
	requestAnimFrame,
	cancelAnimFrame,
	isDef,
	isUndef,
	isFunc,
	warn
} from '../util/util';

import {
	addClass,
	removeClass,
	getOffset
} from '../util/css-util';

import {
	snapToGrid,
	RAD
} from './common';

export default class Subject {

	constructor(el, observable) {
		if (this.constructor === Subject) {
			throw new TypeError('Cannot construct Subject instances directly');
		}

		this.el = el;
		this.storage = null;
		this.proxyMethods = null;
		this.observable = observable;

		this._onMouseDown = this._onMouseDown.bind(this);
		this._onTouchStart = this._onTouchStart.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._onTouchEnd = this._onTouchEnd.bind(this);
		this._animate = this._animate.bind(this);
	}

	enable(options) {
		if (isUndef(this.storage)) {
			this._processOptions(options);
			this._init(this.el);
		} else {
			warn('Already enabled');
		}
	}

	disable() {
		const {
			storage,
			proxyMethods,
			el
		} = this;

		if (isUndef(storage)) return;

		// unexpected case
		if (storage.onExecution) {
			this._end();
			helper(document)
				.off('mousemove', this._onMouseMove)
				.off('mouseup', this._onMouseUp)
				.off('touchmove', this._onTouchMove)
				.off('touchend', this._onTouchEnd);
		}

		removeClass(el, 'sjx-drag');

		this._destroy();
		this.unsubscribe();

		proxyMethods.onDestroy.call(this, el);
		delete this.storage;
	}

	_init() { }

	_destroy() { }

	_cursorPoint() { }

	_drag() {
		this._processMove(...arguments);
		this.proxyMethods.onMove.call(this, ...arguments);
	}

	_rotate() {
		this._processRotate(...arguments);
		this.proxyMethods.onRotate.call(this, ...arguments);
	}

	_resize() {
		this._processResize(...arguments);
		this.proxyMethods.onResize.call(this, ...arguments);
	}

	_processOptions(options) {
		const { el } = this;

		addClass(el, 'sjx-drag');

		const _snap = {
			x: 10,
			y: 10,
			angle: 10 * RAD
		};

		const _each = {
			move: false,
			resize: false,
			rotate: false
		};

		let _restrict = null,
			_proportions = false,
			_axis = 'xy',
			_cursorMove = 'auto',
			_cursorResize = 'auto',
			_cursorRotate = 'auto',
			_themeColor = '#00a8ff',
			_rotationPoint = false,
			_onInit = () => { },
			_onMove = () => { },
			_onRotate = () => { },
			_onResize = () => { },
			_onDrop = () => { },
			_onDestroy = () => { };

		let _container = el.parentNode;

		if (isDef(options)) {
			const {
				snap,
				each,
				axis,
				cursorMove,
				cursorResize,
				cursorRotate,
				rotationPoint,
				restrict,
				onInit,
				onDrop,
				onMove,
				onResize,
				onRotate,
				onDestroy,
				container,
				proportions,
				themeColor
			} = options;

			if (isDef(snap)) {
				const { x, y, angle } = snap;

				_snap.x = isUndef(x) ? 10 : x;
				_snap.y = isUndef(y) ? 10 : y;
				_snap.angle = isUndef(angle)
					? _snap.angle
					: angle * RAD;
			}

			if (isDef(each)) {
				const { move, resize, rotate } = each;

				_each.move = move || false;
				_each.resize = resize || false;
				_each.rotate = rotate || false;
			}

			if (isDef(restrict)) {
				_restrict = restrict === 'parent'
					? el.parentNode
					: helper(restrict)[0] || document;
			}

			_themeColor = themeColor || '#00a8ff';
			_cursorMove = cursorMove || 'auto';
			_cursorResize = cursorResize || 'auto';
			_cursorRotate = cursorRotate || 'auto';
			_axis = axis || 'xy';

			_container = isDef(container) && helper(container)[0]
				? helper(container)[0]
				: _container;

			_rotationPoint = rotationPoint || false;
			_proportions = proportions || false;

			_onInit = createEvent(onInit);
			_onDrop = createEvent(onDrop);
			_onMove = createEvent(onMove);
			_onResize = createEvent(onResize);
			_onRotate = createEvent(onRotate);
			_onDestroy = createEvent(onDestroy);

			_onInit.call(this, el);
		}

		this.options = {
			axis: _axis,
			themeColor: _themeColor,
			cursorMove: _cursorMove,
			cursorRotate: _cursorRotate,
			cursorResize: _cursorResize,
			rotationPoint: _rotationPoint,
			restrict: _restrict,
			container: _container,
			snap: _snap,
			each: _each,
			proportions: _proportions
		};

		this.proxyMethods = {
			onInit: _onInit,
			onDrop: _onDrop,
			onMove: _onMove,
			onResize: _onResize,
			onRotate: _onRotate,
			onDestroy: _onDestroy
		};

		this.subscribe(_each);
	}

	_draw() {
		this._animate();
	}

	_animate() {
		const self = this;
		const {
			observable,
			storage,
			options
		} = self;

		if (isUndef(storage)) return;

		storage.frame = requestAnimFrame(self._animate);

		if (!storage.doDraw) return;
		storage.doDraw = false;

		let {
			dox,
			doy,
			clientX,
			clientY,
			doDrag,
			doResize,
			doRotate,
			doSetCenter,
			revX,
			revY
		} = storage;

		const {
			snap,
			each,
			restrict
		} = options;

		const {
			move: moveEach,
			resize: resizeEach,
			rotate: rotateEach
		} = each;

		if (doResize) {
			const {
				transform,
				cx,
				cy
			} = storage;

			const { x, y } = this._pointToElement(
				{
					x: clientX,
					y: clientY
				}
			);

			let dx = dox
				? snapToGrid(x - cx, snap.x / transform.scX)
				: 0;

			let dy = doy
				? snapToGrid(y - cy, snap.y / transform.scY)
				: 0;

			dx = dox ? (revX ? (-dx) : dx) : 0;
			dy = doy ? (revY ? (-dy) : dy) : 0;

			self._resize(
				dx,
				dy
			);

			if (resizeEach) {
				observable.notify('onresize',
					self,
					{
						dx,
						dy
					}
				);
			}
		}

		if (doDrag) {
			const {
				restrictOffset,
				elementOffset,
				nx,
				ny
			} = storage;

			if (isDef(restrict)) {
				if ((clientX - restrictOffset.left) < nx - elementOffset.left) {
					clientX = nx - elementOffset.left + restrictOffset.left;
				}

				if ((clientY - restrictOffset.top) < ny - elementOffset.top) {
					clientY = ny - elementOffset.top + restrictOffset.top;
				}
			}

			let dx = dox
				? snapToGrid(clientX - nx, snap.x)
				: 0;

			let dy = doy
				? snapToGrid(clientY - ny, snap.y)
				: 0;

			self._drag(
				dx,
				dy
			);

			if (moveEach) {
				observable.notify('onmove',
					self,
					{
						dx,
						dy
					}
				);
			}
		}

		if (doRotate) {
			const {
				pressang,
				center
			} = storage;

			const radians = Math.atan2(
				clientY - center.y,
				clientX - center.x
			) - pressang;

			self._rotate(
				snapToGrid(radians, snap.angle)
			);

			if (rotateEach) {
				observable.notify('onrotate',
					self,
					{
						radians
					}
				);
			}
		}

		if (doSetCenter) {
			const { 
				bx, 
				by 
			} = storage;

			const { x, y } = this._pointToControls(
				{
					x: clientX,
					y: clientY
				}
			);

			self._moveCenterHandle(
				x - bx,
				y - by
			);
		}
	}

	_start(e) {
		if (e.stopImmediatePropagation) {
			e.stopImmediatePropagation();
		}

		const {
			observable,
			storage,
			options,
			el
		} = this;

		const computed = this._compute(e);

		Object.keys(computed).forEach(prop => {
			storage[prop] = computed[prop];
		});

		const {
			onRightEdge,
			onBottomEdge,
			onTopEdge,
			onLeftEdge,
			handle,
			factor,
			revX,
			revY
		} = computed;

		const doResize =
			onRightEdge ||
			onBottomEdge ||
			onTopEdge ||
			onLeftEdge;

		const { 
			handles, 
			radius 
		} = storage;
		
		const { 
			axis, 
			restrict 
		} = options;

		if (isDef(radius)) {
			removeClass(radius, 'sjx-hidden');
		}

		const doRotate = handle.is(handles.rotator),
			doSetCenter = isDef(handles.center)
				? handle.is(handles.center)
				: false;

		const {
			clientX,
			clientY
		} = e;

		const {
			x,
			y
		} = this._cursorPoint(
			{
				clientX,
				clientY
			}
		);

		const {
			x: nx,
			y: ny
		} = this._pointToElement({ x, y });

		const { 
			x: bx, 
			y: by 
		} = this._pointToControls({ x, y });

		const newStorageValues = {
			clientX,
			clientY,
			nx: x,
			ny: y,
			cx: nx,
			cy: ny,
			bx,
			by,
			doResize,
			doDrag: !(doRotate || doResize || doSetCenter),
			doRotate,
			doSetCenter,
			onExecution: true,
			cursor: null,
			elementOffset: getOffset(el),
			restrictOffset: isDef(restrict)
				? getOffset(restrict)
				: null,
			dox: /\x/.test(axis) && (doResize
				?
				handle.is(handles.ml) ||
				handle.is(handles.mr) ||
				handle.is(handles.tl) ||
				handle.is(handles.tr) ||
				handle.is(handles.bl) ||
				handle.is(handles.br)
				: true),
			// eslint-disable-next-line no-useless-escape
			doy: /\y/.test(axis) && (doResize
				?
				handle.is(handles.br) ||
				handle.is(handles.bl) ||
				handle.is(handles.bc) ||
				handle.is(handles.tr) ||
				handle.is(handles.tl) ||
				handle.is(handles.tc)
				: true)
		};

		this.storage = {
			...storage,
			...newStorageValues
		};

		observable.notify(
			'ongetstate',
			this,
			{
				factor,
				revX,
				revY
			}
		);

		this._draw();
	}

	_moving(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}

		const {
			storage,
			options
		} = this;

		const {
			x,
			y
		} = this._cursorPoint(e);

		storage.e = e;
		storage.clientX = x;
		storage.clientY = y;
		storage.doDraw = true;

		let {
			doRotate,
			doDrag,
			doResize,
			cursor
		} = storage;

		const {
			cursorMove,
			cursorResize,
			cursorRotate
		} = options;

		if (isUndef(cursor)) {
			if (doDrag) {
				cursor = cursorMove;
			} else if (doRotate) {
				cursor = cursorRotate;
			} else if (doResize) {
				cursor = cursorResize;
			}
			helper(document.body).css({ cursor });
		}
	}

	_end(e) {
		if (isDef(e) && e.stopImmediatePropagation) {
			e.stopImmediatePropagation();
		}

		const {
			observable,
			storage,
			proxyMethods,
			el
		} = this;

		const action = storage.doResize
			? 'resize'
			: (storage.doDrag ? 'drag' : 'rotate');

		storage.doResize = false;
		storage.doDrag = false;
		storage.doRotate = false;
		storage.doSetCenter = false;
		storage.doDraw = false;
		storage.onExecution = false;
		storage.cursor = null;

		this._apply(action);

		observable.notify(
			'onapply',
			this,
			action
		);

		cancelAnimFrame(storage.frame);
		proxyMethods.onDrop.call(this, e, el);

		helper(document.body).css({ cursor: 'auto' });
		if (isDef(storage.radius)) {
			addClass(storage.radius, 'sjx-hidden');
		}
	}

	_onMouseDown(e) {
		this._start(e);
		helper(document)
			.on('mousemove', this._onMouseMove)
			.on('mouseup', this._onMouseUp);
	}

	_onTouchStart(e) {
		this._start(e.touches[0]);
		helper(document)
			.on('touchmove', this._onTouchMove)
			.on('touchend', this._onTouchEnd);
	}

	_onMouseMove(e) {
		this._moving(
			e,
			this.el
		);
	}

	_onTouchMove(e) {
		this._moving(
			e.touches[0],
			this.el
		);
	}

	_onMouseUp(e) {
		helper(document)
			.off('mousemove', this._onMouseMove)
			.off('mouseup', this._onMouseUp);

		this._end(
			e,
			this.el
		);
	}

	_onTouchEnd(e) {
		helper(document)
			.off('touchmove', this._onTouchMove)
			.off('touchend', this._onTouchEnd);

		if (e.touches.length === 0) {
			this._end(
				e.changedTouches[0],
				this.el
			);
		}
	}

	notifyMove(data) {
		const {
			dx,
			dy
		} = data;

		this._drag(
			dx,
			dy
		);
	}

	notifyRotate(data) {
		const {
			snap
		} = this.options;

		this._rotate(
			snapToGrid(data.radians, snap.angle)
		);
	}

	notifyResize(data) {
		const {
			dx,
			dy,
			dox,
			doy
		} = data;

		this._resize(
			dx,
			dy,
			dox,
			doy
		);
	}

	notifyApply(actionName) {
		this._apply(actionName);
	}

	notifyGetState(data) {
		const { storage } = this;

		const recalc = this._getState(
			data
		);

		this.storage = {
			...storage,
			...recalc
		};
	}

	subscribe(events) {
		const { observable: ob } = this;

		const {
			resize,
			move,
			rotate
		} = events;

		if (move || resize || rotate) {
			ob.subscribe('ongetstate', this)
				.subscribe('onapply', this);
		}

		if (move) {
			ob.subscribe('onmove', this);
		}
		if (resize) {
			ob.subscribe('onresize', this);
		}
		if (rotate) {
			ob.subscribe('onrotate', this);
		}
	}

	unsubscribe() {
		const { observable: ob } = this;

		ob.unsubscribe('ongetstate', this)
			.unsubscribe('onapply', this)
			.unsubscribe('onmove', this)
			.unsubscribe('onresize', this)
			.unsubscribe('onrotate', this);
	}

}

function createEvent(fn) {
	return isFunc(fn)
		? function () {
			fn.call(this, ...arguments);
		}
		: () => { };
}