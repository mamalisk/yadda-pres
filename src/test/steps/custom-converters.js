module.exports = {

    side_converter : function (side, cb){
            var pane = side.toLowerCase() === 'right' ? 'RIGHT' : 'LEFT'
            cb(null, pane);
        },
    
        on_off_converter : function(onOff, cb){
            var isOn = onOff.toLowerCase() === 'on';
            cb(null, isOn); 
        },
        min_max_converter : function(minMax, cb) {
            var isMin = minMax.toLowerCase() === 'min';
            cb(null, isMin);
        },
        integer_converter : function(string, cb) {
            cb(null, Number(string));
        }
}