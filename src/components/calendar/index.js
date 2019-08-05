import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import moment from "moment";

import { momentLocalizer } from 'react-big-calendar'

//import components
import Dnd from "./dndOutsideSource";
import { height } from 'window-size';

//import css
import './big-calendar.css'


const localizer = momentLocalizer(moment)

class BigCalendar extends React.Component {
    render() {
        return (
            <div>
                <div className="big-calendar">
                    <div className="calendar-container">
                        <Dnd
                            height="500px"
                            localizer={localizer}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default BigCalendar