function Eulerian_Path(point_list) {
	return Eulerian_Path_Recur(
			_.mapValues(point_list, function(outs){ 
				return _.map(outs, function(i){ return _.toString(i); }); 
			}), 
			cal_odd_list(point_list), 
			[]
			);
}

function cal_odd_list(point_list){
	return _(point_list).pickBy(function(point){ return point.length%2;}).keys().value();
}

function start_point_list(point_list, odd_list){
	return odd_list.length>0 ? odd_list : _.keys(point_list);
}

function max_length(point_list){
	return _.reduce(point_list, function(result, point){ return result + point.length}, 0)/2;
}

function valid(point_list, answer){
	return !_(point_list)
		.map(function(outs, point){
			return _(outs)
				.map(function(out){
					return answer.indexOf( point + "-" + out) < 0 && 
						answer.indexOf( out + "-" + point) < 0 
				}).some();
		}).some();
}

function Eulerian_Path_Recur(point_list, odd_list, answer){

	if (odd_list.length > 2) {
		console.log("No Solution.");
		return;
	}

	if (answer.length === max_length(point_list)){
		if (valid(point_list, answer))
			return _(answer)
				.dropRight()
				.map(function(side){ return side.split("-")[0]; })
				.value()
				.join("-")
				+ "-" + _.last(answer);
		else
			return [];
	}

	return _( _.isEmpty(answer)? start_point_list(point_list, odd_list) : [_.last(answer).split("-")[1]])
		.map(function(point) {
			return _.map(point_list[point], function(out){
					if (answer.indexOf(out+"-"+point) < 0 &&
						answer.indexOf(point+"-"+out) < 0)
						return Eulerian_Path_Recur(
							point_list,
							odd_list,
							_.union(answer, [point+"-"+out]));
					else 
						return [];
				})
		})
		.flatten()
		.filter(function(result){ return result.length > 0;})
		.thru(function(result){
			if (typeof(_.head(result)) !== 'string' )
				return _.flatten(result);
			return result;
		})
		.value();
}