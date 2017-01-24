class TimersDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timers: [
        {
          title: 'Practice squat',
          project: 'Gym Chores',
          id: uuid.v4(),
          elapsed: 5456099,
          runningSince: Date.now(),
        },
        {
          title: 'Bake squash',
          project: 'Kitchen Chores',
          id: uuid.v4(),
          elapsed: 1273998,
          runningSince: null,
        },    
      ]
    };
    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.createTimer = this.createTimer.bind(this);
  }

  handleCreateFormSubmit(timer) {
    this.createTimer(timer)
  }

  createTimer(timer) {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });
  }
  
  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList 
            timers={this.state.timers} 
          />
          <ToggleableTimerForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer 
          key={timer.id}
          id={timer.id}
          title={timer.title}
          project={timer.project}
          elapsed={timer.elapsed}
          runningSince={timer.runningSince}
      />
    ))
    return (
      <div id='timers'>
        {timers}
      </div>
    );
  }
}

class EditableTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFormOpen: false
    }
  }
  
  render() {
    if(this.state.editFormOpen){
      return (
        <TimerForm 
          id={this.props.id}
          title={this.props.title} 
          project={this.props.project}
        />
      )
    } else {
      return (
        <Timer
          id={this.props.id}
          title={this.props.title} 
          project={this.props.project} 
          elapsed={this.props.elapsed} 
          runningSince={this.props.runningSince}
        />
      )
    }
  }
}

class ToggleableTimerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.handleFormOpen = this.handleFormOpen.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormClose = this.handleFormClose.bind(this);
  }

  handleFormOpen() {
    this.setState({ isOpen: true });
  }

  handleFormSubmit(timer) {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  }

  handleFormClose() {
    this.setState({ isOpen: false });
  }
  
  render() {
    if(this.state.isOpen) {
      return (
        <TimerForm 
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button className='ui basic button icon' onClick={this.handleFormOpen}>
            <i className='plus icon'></i>
          </button>
        </div>
      )
    }
  }
}


class TimerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit () {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.refs.title.value,
      project: this.refs.project.value,
    })
  }
  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input type='text' ref='title' defaultValue={this.props.title} /> 
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' ref='project' defaultValue={this.props.project} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button className='ui basic blue button' onClick={this.handleSubmit}>
                {submitText}
              </button>
              <button className='ui basic red button' onClick={this.props.onFormClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed);
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'> 
            {this.props.title}
          </div>
          <div className='meta'>
            {this.props.project} 
          </div>
          <div className='center aligned description'>
            <h2> {elapsedString} </h2> 
          </div>
          <div className='extra content'>
            <span className='right floated edit icon'>
              <i className='edit icon'></i>
            </span>
            <span className='right floated trash icon'>
              <i className='trash icon'></i>
            </span>
          </div>
        </div>
        <div className='ui bottom attached blue basic button'>
          Start
        </div>
      </div>
    );
  }
}

ReactDOM.render(<TimersDashboard />, document.getElementById('content'));