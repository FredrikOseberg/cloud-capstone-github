class WidgetRegistry {
  constructor(setStateFunc, actionProvider) {
    this.setState = setStateFunc;
    this.actionProvider = actionProvider;
  }

  addWidget = ({
    widgetName,
    widgetFunc,
    mapStateToProps,
    props,
    updateKey
  }) => {
    this[widgetName] = {
      widget: widgetFunc,
      props,
      mapStateToProps,
      updateKey
    };
  };

  getWidget = (widgetName, state) => {
    const widgetObject = this[widgetName];

    if (!widgetObject) return;

    let props = {
      scrollIntoView: state.scrollIntoView,
      ...widgetObject.props,
      ...this.mapStateToProps(widgetObject.mapStateToProps, state),
      setState: this.setState,
      actionProvider: this.actionProvider
    };

    if (widgetObject.updateKey) {
      const { updateKey } = widgetObject;
      props = { ...props, updateKey };
    }

    return widgetObject.widget(props);
  };

  mapStateToProps = (props, state) => {
    if (!props) return;

    return props.reduce((acc, prop) => {
      acc[prop] = state[prop];
      return acc;
    }, {});
  };
}

export default WidgetRegistry;
