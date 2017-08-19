var propsFromUrl = function(props)
{
    if (window.location.hash) {
        try {
            var data = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));

            props.initialState = props.initialState || {};

            for (var d in data) {
                if (data.hasOwnProperty(d)) {
                    props.initialState[d] = data[d];
                }
            }
        } catch(e) {
            console.warn(e);
        }
    }

    var otherOnStateChange = null;

    if (typeof props.onStateChange !== 'undefined') {
        otherOnStateChange = props.onStateChange;
    }

    props.onStateChange = function(state) {
        if (otherOnStateChange) {
            otherOnStateChange(state);
        }

        var json = JSON.stringify(state);
        // Remove useless keys
        json = json.replace(/,"focused_mission":[0-9-]+/, '');
        json = json.replace(',"locale":"fr"', '');
        json = json.replace(',"locale":"en"', '');

        window.location.hash = json;
    };

    return props;
};
