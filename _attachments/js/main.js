CARDVIZ = {
	MONTHS: [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	],

	init: function() {
		var setColors = function(json) {
			var w = $('#colors').width();
			var h = $('#colors').height();
			var center = [Math.floor(w/2), Math.floor(h/2)]

			if (json) {
				var gradients = d3.select('#colors').selectAll('linearGradient')
					.data(json.rows)
					.enter()
					.append('linearGradient')
					.attr('id', function(d) {
						return d.id + '-gradient';
					});

				gradients.selectAll('stop')
					.data(function (d) {
						return d.value;
					})
					.enter()
					.append('stop')
					.attr('offset', function (d) {
						return d.offset;
					})
					.attr('stop-color', function (d) {
						return '#' + d['stop-color'];
					});

				d3.select('#colors').selectAll('rect')
					.data(json.rows)
					.enter()
					.append('rect')
					.attr('fill', function (d) {
						return 'url(#' + d.id + '-gradient)';
				  	})
				  	.attr('x', function (d, i) {
				  		return center[0] + 180 + (d.key[2] * 42);
				  	})
				  	.attr('y', (center[1] - 25))
				  	.attr('width', 38)
				  	.attr('height', 50)
				  	.attr('transform', function (d) {
				  		var angle = 30 + d.key[1] * 30;
				  		return 'rotate(' + angle + ',' + center[0] + ',' + center[1] + ')';
				  	});

				 d3.select('#colors').selectAll('text')
				 	.data(json.rows)
				 	.enter()
				 	.append('text')
				 	.attr('x', center[0])
				 	.attr('y', center[1] - 150)
				 	.attr('width', 50)
				 	.attr('transform', function (d) {
				 		var angle = 120 + (d.key[1] * 30);
				 		return 'rotate(' + angle + ',' + center[0] + ',' + center[1] + ')';
				 	})
				 	.text(function (d) {
				 		return CARDVIZ.MONTHS[d.key[1]];
				 	});
			}
		};

		var bargraph = function (json) {
			if (json) {
				var w = $('#senders').width() / json.rows.length;
				var h = $('#senders').height();
				var margin = Math.max(1, Math.floor(w * 0.1));
				var scale = d3.scale.linear()
					.domain([0, d3.max(json.rows.map(function (d) {
						return d.value;
					}))])
					.range([0, h * 0.9]);

				d3.select('#senders').selectAll('rect')
					.data(json.rows)
					.enter()
					.append('rect')
					.attr('class', 'bar')
					.attr('x', function (d, i) {
						return margin + (i * w);
					})
					.attr('y', function (d) {
						return h - scale(d.value);
					})
					.attr('width', w - (2 * margin))
					.attr('height', function (d) {
						return scale(d.value);
					});

				d3.select('#senders').selectAll('text')
					.data(json.rows)
					.enter()
					.append('text')
					.attr('x', function (d, i) {
						return i * w + (w / 2);
					})
					.attr('y', h)
					.text(function (d) {
						return d.key;
					});
			}
		};

		d3.json('/cards/_design/cardviz/_view/colors', setColors);
		d3.json('/cards/_design/cardviz/_view/senders?group=true', bargraph);
	}
};

UTIL = {
  exec: function(controller, action) {
    var ns = SITENAME,
        action = (action === undefined) ? "init" : action;
 
    if (controller !== "" && ns[controller] && typeof ns[controller][action] == "function") {
      ns[controller][action]();
    }
  },
 
  init: function() {
    var body = document.body,
        controller = body.getAttribute("data-controller"),
        action = body.getAttribute("data-action");
 
    UTIL.exec("common");
    UTIL.exec(controller);
    UTIL.exec(controller, action);
  }
};
 
$(document).ready(CARDVIZ.init);