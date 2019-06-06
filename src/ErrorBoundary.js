import React, {Component} from 'react';

class ErrorBoundary extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
        }
    }


    componentDidCatch(error, info) {
        this.setState({hasError: true})
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Sorry, something went wrong with the API!</h1>
                    <h1>Please refresh, and wait a while before using the app again!</h1>
                </div>
            )
        } else {
            return this.props.children
        }
    }
}

export default ErrorBoundary