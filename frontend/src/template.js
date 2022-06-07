// IMPORTS
import React, { Component } from 'react';
import SamplePropTypes from 'prop-types';

// Note : SamplePropTypes is a dummy object for this example. 

/** Title of Component : SomeReactComponent
 *  Description: This is an react component that echo an hello world
 *  Output : A page with a "Hello World" on it.
 */
class SomeReactComponent extends Component {
  render() {
    return <div> {this.props.title} </div>;
  }
}

SomeReactComponent.propTypes = {
  /**
   * The title of this component
   */
  title: SamplePropTypes.string,
};

SomeReactComponent.defaultProps = {
/**
* Description : Sets the title to "Hello world."
*/
  title: 'Hello world',
};


// Export React Component
export default SomeReactComponent;

/** References that may be used:
 * - plugins/commands that automatically generates documentations: 
 * https://medium.com/front-end-weekly/documenting-your-code-could-be-simple-with-this-react-plugin-1157792f2427
 * - https://stackoverflow.com/questions/41847565/how-to-do-documentation-in-reactjs
 * 
 * ReactJS Frontend Refresher:
 * - https://medium.com/front-end-weekly/a-beginners-guide-building-front-end-applications-with-react-1f0d3e75c0a7
 * 
 * 
 * Feel free to add more resources to this part :)
**/