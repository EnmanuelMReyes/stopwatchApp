import React, { Component } from 'react';

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minute: 0,
            second: 0,
            miliSecond: 0
        }
    }
    render() {
        return (<div>
            <p>{this.state.time}</p>
        </div>);
    }

    con
}

export default Counter;
