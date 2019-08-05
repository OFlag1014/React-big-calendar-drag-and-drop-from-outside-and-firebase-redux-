import React from 'react'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import Layout from 'react-tackle-box/Layout'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux'
import PropTypes, { element } from 'prop-types'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

//import actions
import { addElement } from '../../store/actions/calendarActions'

import Card from './Card'
import events from './events'

//import css
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import './calendar.css'
import { template } from 'handlebars';

//declare gobal functions
const DragAndDropCalendar = withDragAndDrop(Calendar)
const formatName = (name, count) => `${name}  ${count}`

class Dnd extends React.Component {
  
  static propTypes = {
    uid: PropTypes.string,
    firestore: PropTypes.shape({
      add: PropTypes.func.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      events: events,
      draggedEvent: null,
      counters: null,
      elements: null,
      displayDragItemInCell: true,
      dialogOpen: false,
      element_id: '',
      element_name: '',
    }

    this.handleDisplayDragItemInCell = this.handleDisplayDragItemInCell.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.dragFromOutsideItem = this.dragFromOutsideItem.bind(this);
    this.customOnDragOver = this.customOnDragOver.bind(this);
    this.onDropFromOutside = this.onDropFromOutside.bind(this);
    this.moveEvent = this.moveEvent.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
    this.newEvent = this.newEvent.bind(this);

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.handleNameTextFieldChange = this.handleNameTextFieldChange.bind(this);
    this.handleIdTextFieldChange = this.handleIdTextFieldChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    var counters = {};
    if (nextProps.elements) {
      nextProps.elements.map((element, index) => {
        console.log("element: ", element);
        counters[element.element_name] = index;
      })
    }
    console.log("here is conunters: ", counters);
    this.setState({
      counters: counters
    })
  }

  handleDragStart = event => {
    this.setState({ draggedEvent: event })
  }

  handleDisplayDragItemInCell = () => {
    this.setState({
      displayDragItemInCell: !this.state.displayDragItemInCell,
    })
  }

  dragFromOutsideItem = () => {
    return this.state.draggedEvent
  }

  customOnDragOver = event => {
    // check for undroppable is specific to this example
    // and not part of API. This just demonstrates that
    // onDragOver can optionally be passed to conditionally
    // allow draggable items to be dropped on cal, based on
    // whether event.preventDefault is called
    if (this.state.draggedEvent !== 'undroppable') {
      console.log('preventDefault')
      event.preventDefault()
    }
  }

  onDropFromOutside = ({ start, end, allDay }) => {
    const { draggedEvent, counters } = this.state
    const event = {
      title: formatName(draggedEvent.name, counters[draggedEvent.name]),
      start,
      end,
      isAllDay: allDay,
    }
    const updatedCounters = {
      ...counters,
      [draggedEvent.name]: counters[draggedEvent.name] + 1,
    }
    this.setState({ draggedEvent: null, counters: updatedCounters })
    this.newEvent(event)
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

    //alert(`${event.title} was resized to ${start}-${end}`)
  }

  newEvent(event) {
    let idList = this.state.events.map(a => a.id)
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: event.title,
      allDay: event.isAllDay,
      start: event.start,
      end: event.end,
    }
    this.setState({
      events: this.state.events.concat([hour]),
    })
  }

  handleClickOpen = () => {
    this.setState({
      dialogOpen: true,
    });
  }

  handleClose = () => {
    this.setState({
      dialogOpen: false,
      element_id: '',
      element_name: ''
    });
  }

  handleSave = () => {
    this.props.addElement(this.state.element_name);
    this.handleClose();
  }

  handleNameTextFieldChange = ($e) => {
    this.setState({
      element_name: $e.target.value
    })
  }

  handleIdTextFieldChange = ($e) => {
    this.setState({
      element_id: $e.target.value
    })
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    return (
      <div>
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Adding Drad And Drop Element</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add drag and drop element click Save button. This will be saved onto firebase.
            </DialogContentText>
            <TextField
              id="elemet_name"
              className="element_name"
              value={this.state.element_name}
              label="Name"
              placeholder="Enter Name"
              margin="normal"
              type="text"
              InputProps={{disableUnderline: true}}
              fullWidth
              onChange={this.handleNameTextFieldChange}
            />
            {/* <TextField
              id="element_id"
              className="element_id"
              value={this.state.element_id}
              label="ID"
              placeholder="Enter ID"
              margin="normal"
              type="number"
              InputProps={{disableUnderline: true}}
              fullWidth
              onChange={this.handleIdTextFieldChange}
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSave} color="primary">
              Save
              </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
              </Button>
          </DialogActions>
        </Dialog>
        <Card className="examples--header" style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            { /* <h4 style={{ color: 'gray', width: '100%' }}>
              Outside Drag Sources
              </h4> */}
            { this.state.counters && Object.entries(this.state.counters).map(([name, count]) => (
              <div
                style={{
                  border: '2px solid gray',
                  borderRadius: '4px',
                  width: '100px',
                  margin: '10px',
                  textAlign: "center"
                }}
                className="justify-content-center align-self-center"
                draggable="true"
                key={name}
                onDragStart={() =>
                  this.handleDragStart({ title: name, name })
                }
              >
                {/* {formatName(name, count)} */}
                { name }
              </div>
            ))}
          </div>
          <Button variant="outlined" style={{ margin: '10px', float: 'right' }} color="primary" onClick={this.handleClickOpen}>
            Add Drag And Drop Element
          </Button>
        </Card>
        <DragAndDropCalendar
          selectable
          localizer={this.props.localizer}
          events={this.state.events}
          onEventDrop={this.moveEvent}
          dragFromOutsideItem={
            this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
          }
          onDropFromOutside={this.onDropFromOutside}
          onDragOver={this.customOnDragOver}
          resizable
          onEventResize={this.resizeEvent}
          onSelectSlot={this.newEvent}
          defaultView={Views.MONTH}
          defaultDate={new Date(2015, 3, 12)}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    calendar: state.calendar,
    auth: state.firebase.auth,
    elements: state.firestore.ordered.elements
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addElement: (name, id) => dispatch(addElement(name, id))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'elements'}
  ])
  )(Dnd);
