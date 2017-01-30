class TimersDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timers: []
    };
    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.createTimer = this.createTimer.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.deleteTimer = this.deleteTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.loadTimersFromServers = this.loadTimersFromServers.bind(this);
  }

  handleStartClick(timerId) {
    this.startTimer(timerId);
  }

  handleStopClick(timerId) {
    this.stopTimer(timerId);
  }

  handleCreateFormSubmit(timer) {
    this.createTimer(timer);
  }

  handleEditFormSubmit(attrs) {
    this.updateTimer(attrs);
  }

  handleDelete(attr) {
    this.deleteTimer(attr);
  }

  createTimer(timer) {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });

    client.createTimer(timer)
  }

  updateTimer(attrs) {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title, 
            project: attrs.project
          });
        } else {
          return timer;
        }
      }) 
    })

    client.updateTimer(attrs)
  }

  deleteTimer(attr) {
    this.setState({
      timers: this.state.timers.filter(timer => timer.id !== attr.id),
    })

    client.deleteTimer({
      id: attr.id
    })
  }

  startTimer(timerId) {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id === timerId) {
          return (
            Object.assign({}, timer, {
              runningSince: now,
            })
          )
        } else {
          return timer
        }
      })
    });

    client.startTimer({
      id: timerId,
      start: now
    })
  }

  stopTimer(timerId) {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return (
            Object.assign({}, timer, {
              elapsed: timer.elapsed + lastElapsed,
              runningSince: null,
            })
          )
        } else {
          return timer
        }
      })
    });

    client.stopTimer({
      id: timerId,
      stop: now
    })
  }
  
  componentDidMount(){
    this.loadTimersFromServers();
    setInterval(this.loadTimersFromServers, 5000);
  }

  loadTimersFromServers(){
    client.getTimers((setTimers) => {
      this.setState({timers: setTimers})
    })
  }

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList 
            timers={this.state.timers} 
            onFormSubmit={this.handleEditFormSubmit}
            handleDelete={this.handleDelete}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
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
          onFormSubmit={this.props.onFormSubmit}
          handleDelete={this.props.handleDelete}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
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

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleFormClose = this.handleFormClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
  }

  handleEditClick() {
    this.openForm();
  }

  handleFormClose() {
    this.closeForm();
  }

  handleSubmit(timer) {
    this.props.onFormSubmit(timer);
    this.closeForm();
  }
  
  openForm() {
    this.setState({ editFormOpen: true })
  }
  
  closeForm() {
    this.setState({ editFormOpen: false })
  }
  
  render() {
    if(this.state.editFormOpen){
      return (
        <TimerForm 
          id={this.props.id}
          title={this.props.title} 
          project={this.props.project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
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
          onEditClick={this.handleEditClick}
          onDelete={this.props.handleDelete}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
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
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    // this.forceUpdateInterval = this.forceUpdateInterval.bind(this);
    // this.forceUpdate = this.forceUpdate.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
  }

  handleStartClick() {
    this.props.onStartClick(this.props.id);
  }

  handleStopClick() {
    this.props.onStopClick(this.props.id);
  }

  handleDelete() {
    this.props.onDelete({
      id: this.props.id
    })
  }

  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }
  
  // Happens when component is deleted. Called before component is removed from the app
  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
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
            <span className='right floated edit icon' onClick={this.props.onEditClick}>
              <i className='edit icon'></i>
            </span>
            <span className='right floated trash icon' onClick={this.handleDelete}>
              <i className='trash icon'></i>
            </span>
          </div>
        </div>
        <TimerButton
          timerIsRunning={!!this.props.runningSince}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
        />
      </div>
    );
  }
}

class TimerButton extends React.Component {
  render() {
    return (
      this.props.timerIsRunning ? (
        <div
          className='ui bottom attached red basic button' 
          onClick={this.props.onStopClick}
        > 
          Stop
        </div>
      ) : (
        <div 
          className='ui bottom attached green basic button' 
          onClick={this.props.onStartClick}
        >
          Start
        </div> )
    );
  }
}

ReactDOM.render(<TimersDashboard />, document.getElementById('content'));