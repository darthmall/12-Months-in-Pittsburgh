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

				var viz = d3.select('#colors').append('g')
					.attr('transform', 'translate(' + center[0] + ',' + center[1] + ')');

				viz.selectAll('rect')
					.data(json.rows)
					.enter()
					.append('rect')
					.attr('fill', function (d) {
						return 'url(#' + d.id + '-gradient)';
				  	})
				  	.attr('x', function (d, i) {
				  		return 60 + (d.key[2] * 32);
				  	})
				  	.attr('y', -15)
				  	.attr('width', 30)
				  	.attr('height', 30)
				  	.attr('transform', function (d) {
				  		var angle = 30 + d.key[1] * 30;
				  		return 'rotate(' + angle + ')';
				  	});

				 viz.selectAll('text')
				 	.data(json.rows)
				 	.enter()
				 	.append('text')
				 	.attr('x', 0)
				 	.attr('y', -150)
				 	.attr('width', 50)
				 	.attr('transform', function (d) {
				 		var angle = 120 + (d.key[1] * 30);
				 		return 'rotate(' + angle + ')';
				 	})
				 	.text(function (d) {
				 		return CARDVIZ.MONTHS[d.key[1]];
				 	});
			}
		};

		var bargraph = function (json) {
			if (json) {
				var w = $('#senders').width();
				var h = $('#senders').width() / json.rows.length;
				var margin = Math.max(1, Math.floor(h * 0.1));
				var scale = d3.scale.linear()
					.domain([0, d3.max(json.rows.map(function (d) {
						return d.value;
					}))])
					.range([0, w * 0.9]);

				d3.select('#senders').selectAll('rect')
					.data(json.rows)
					.enter()
					.append('rect')
					.attr('class', 'bar')
					.attr('x', 0)
					.attr('y', function (d, i) {
						return margin + (i * h);
					})
					.attr('width', function (d) {
						return scale(d.value);
					})
					.attr('height', h - (2 * margin));

				d3.select('#senders').selectAll('text')
					.data(json.rows)
					.enter()
					.append('text')
					.attr('x', 5)
					.attr('y', function (d, i) {
						return i * h + (h / 2);
					})
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