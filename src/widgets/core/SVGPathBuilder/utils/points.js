export function M(x, y) {
	return (!isNaN(x) && !isNaN(y)) ? { x, y } : {};
}

export function L(x, y) {
	return M(x, y);
}

export function Q(x, y, qx, qy) {
	return {
		...L(x, y),
		quadratic: { t: false, x: qx, y: qy },
	};
}

export function T(x, y, qx, qy) {
	const q = Q(x, y, qx, qy);

	q.quadratic.t = true;

	return q;
}

export function C(x, y, x1, y1, x2, y2) {
	return {
		...L(x, y),
		cubic: { s: false, x1, y1, x2, y2 },
	};
}

export function S(x, y, x1, y1, x2, y2) {
	const c = C(x, y, x1, y1, x2, y2);

	c.cubic.s = true;

	return c;
}

export function A(x, y, rx, ry, rot, laf, sf) {
	return {
		...L(x, y),
		arc: { rx, ry, rot, laf, sf },
	};
}

export function getPoints(path) {
	let re = /(m|l|h|v|q|t|c|s|a) ?([0-9,|. ]+)/gi,
		points = [],
		_points = [],
		match;

	while ((match = re.exec(path.trim())) !== null) {
		points.push({
			type: match[1],
			values: match[2].trim().split(/\s*,\s*|\s+/),
		});
	}

	points.forEach(({ type, values }) => {
		let point = false;

		switch (type.toLowerCase()) {
		case 'm': point = M(...values);
			break;
		case 'l': point = L(...values);
			break;
		case 'q': point = Q(...values);
			break;
		case 't': point = T(...values);
			break;
		case 'c': point = C(...values);
			break;
		case 's': point = S(...values);
			break;
		case 'a': point = A(...values);
			break;
		default:
			break;
		}

		if (point) {
			_points.push(point);
		}
	});

	return _points;
}


function getPathArray(path) {
	if (!path) return {};
	const newPath = path.replace(/,/g,' ');
	const pathArr = newPath.split(' ');
	const newPathArr = [];
	for (let i = 0; i < pathArr.length; i++) {
		const current = pathArr[i];
		if (current && current.trim()) {
			if (/m|l|h|v|q|t|c|s|a|z/g.test(current[0].toLowerCase())) {
				newPathArr.push(current[0].toLowerCase());
				if (current[1]) {
					newPathArr.push(current.slice(1).trim());
				}
			} else {
				newPathArr.push(current.trim());
			}
		}

	}
	return newPathArr;
}

export function pathToObject(path) {
	const pathArr = getPathArray(path);
	const points = [];
	for (let i = 0 ; i < pathArr.length; ) {
		const current = pathArr[i];
		let point = false;
		switch(current) {
		case 'm': {
			point = M(pathArr[i+1], pathArr[i+2]);
			i += 3;
			break;
		}
		case 'l': {
			point = L(pathArr[i+1], pathArr[i+2]);
			i += 3;
			break;
		}
		case 'q': {
			point = Q(pathArr[i+3], pathArr[i+4], pathArr[i+1], pathArr[i+2]);
			i += 5;
			break;
		}
		case 't': {
			if (!isNaN(pathArr[i+3]) && !isNaN(pathArr[i+4])) {
				point = T(pathArr[i+3], pathArr[i+4], pathArr[i+1], pathArr[i+2]);
				i += 5;
			} else {
				point = T(pathArr[i+1], pathArr[i+2]);
				i += 3;
			}
			break;
		}
		case 'c': {
			if (!isNaN(pathArr[i+5]) && !isNaN(pathArr[i+6])) {
				point = C(pathArr[i+5], pathArr[i+6], pathArr[i+1], pathArr[i+2], pathArr[i+3], pathArr[i+4]);
				i += 7;
			} else {
				point = C(pathArr[i+1], pathArr[i+2], pathArr[i+3], pathArr[i+4]);
				i += 5;
			}
			break;
		}
		case 's': {
			if (!isNaN(pathArr[i+5]) && !isNaN(pathArr[i+6])) {
				point = S(pathArr[i+5], pathArr[i+6], pathArr[i+1], pathArr[i+2], pathArr[i+3], pathArr[i+4]);
				i += 7;
			} else {
				point = S(pathArr[i+1], pathArr[i+2], pathArr[i+3], pathArr[i+4]);
				i += 5;
			}
			break;
		}
		case 'a': {
			if (!isNaN(pathArr[i+6]) && !isNaN(pathArr[i+7])) {
				point = A(pathArr[i+6], pathArr[i+7], pathArr[i+1], pathArr[i+2], pathArr[i+3], pathArr[i+4], pathArr[i+5]);
				i += 8;
			} else {
				point = A(pathArr[i+1], pathArr[i+2], pathArr[i+3], pathArr[i+4], pathArr[i+5]);
				i += 6;
			}
			break;
		}
		case 'z': return {points, isClose: true};
		default:
			return [];
		}
		if (point) {
			points.push(point);
		}
	}

	return {points};
}

