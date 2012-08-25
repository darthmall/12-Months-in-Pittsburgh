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
					})
					.attr('x1', 0)
					.attr('x2', 0)
					.attr('y1', 0)
					.attr('y2', '100%');

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
				  		return center[0] + 70 + (Number(d.key[2]) * 55);
				  	})
				  	.attr('y', (center[1] - 25))
				  	.attr('width', 50)
				  	.attr('height', 50)
				  	.attr('transform', function (d) {
				  		var angle = 30 + (Number(d.key[1]) - 1) * 30;
				  		return 'rotate(' + angle + ',' + center[0] + ',' + center[1] + ')';
				  	});

				 d3.select('#colors').selectAll('text')
				 	.data(json.rows)
				 	.enter()
				 	.append('text')
				 	.attr('x', center[0])
				 	.attr('y', center[1] - 100)
				 	.attr('width', 50)
				 	.attr('transform', function (d) {
				 		var angle = 120 + ((Number(d.key[1]) - 1) * 30);
				 		return 'rotate(' + angle + ',' + center[0] + ',' + center[1] + ')';
				 	})
				 	.text(function (d) {
				 		return CARDVIZ.MONTHS[Number(d.key[1]) - 1];
				 	});
			}
		};

		d3.json('/cards/_design/cardviz/_view/colors', setColors);
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