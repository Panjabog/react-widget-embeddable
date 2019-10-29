import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import 'react-dates/lib/css/_datepicker.css'
import 'react-dates/initialize'
import { DateRangePicker, SingleDatePicker } from 'react-dates'
import Autocomplete from 'react-autocomplete'
import axios from 'axios'

import './widget.scss'
import BackGround from './assets/background_desktop.jpg'
import KohIcon from './assets/icr_logo_yellow.png'
import VehicleIcon from './assets/homepage-icon.png'

const ImgDiv = styled.div`
  background-image: url(${BackGround});
  background-position: center center;
  background-color: grey;
  background-size: cover;
  background-repeat: no-repeat;
  height: 430px;
  width: 320px;
  border-radius: 10px;
  margin: 30px auto 30px auto;
  padding: 10px 18px 0 18px;

  ._logo {
    height: 58px;
  }

  ._webText {
    font-family: 'Ubuntu';
    font-size: 22px;
    color: #ffc800;
    font-weight: 700;
    margin: 0 0 10px;
  }

  ._descText {
    font-family: 'Ubuntu';
    font-size: 22px;
    color: #ffffff;
    font-weight: 700;
    margin: 0 0 5px;
    width: ${320 - 36}px;
    word-wrap: break-word;
  }

  ._vehicleIcon {
    height: 26px;
    margin-bottom: 15px;
  }
`

const departureData = location => {
  let loc = location.map(({ id, name, url_key }, index) => {
    return {
      ['id']: id,
      ['url_key']: url_key,
      ['label']: name,
      ['value']: name
    }
  })

  return loc
}

const findUrlKey = (option, value) => {
  let url = option.filter(item => {
    return item.label === value
  })

  // console.log('url >>> ', url, 'url_key', url[0])
  return url[0].url_key
}

const filterRouteBlank = (option, routematch) => {
  let filter = []

  Object.keys(routematch).forEach(key => {
    // console.log('filterRouteBlank key >>> ', key)

    option.map(item => {
      if (item.id === Number(key)) {
        filter.push(item)
      }
    })
  })

  return filter
}

class KohWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      departure: 'Bangkok',
      departureOption: [],
      departureKey: 'bangkok',
      arrival: 'Chiangmai',
      arrivalOption: [],
      arrivalKey: 'chiangmai',
      routematch: {}
    }
  }

  componentDidMount() {
    axios
      .get(
        `https://82ywqgk2ik.execute-api.ap-southeast-1.amazonaws.com/dev/locations/searchbox`
      )
      .then(res => {
        const data = res.data
        // console.log('locations data >>> ', data.message)

        if (data.status) {
          this.setState({
            departureOption: departureData(data.message),
            arrivalOption: departureData(data.message)
          })
        }
      })

    axios
      .get(
        `https://7eliseuvsc.execute-api.ap-southeast-1.amazonaws.com/dev/transportations/routesMatch`
      )
      .then(res => {
        const data = res.data
        // console.log('routematch data >>> ', data.message)

        if (data.status) {
          this.setState({ routematch: data.message })
        }
      })
  }

  handleChange = name => event => {
    const { departureOption, routematch } = this.state

    if (name === 'departure') {
      console.log('departure')

      this.setState({ [name]: event.target.value })
    } else {
      // console.log('arrival')
      this.setState({ [name]: event.target.value })
    }
  }

  handleSelect = name => val => {
    const { departureOption, routematch } = this.state

    if (name === 'departure') {
      this.handleArrival(departureOption, routematch, val)

      // console.log('departure >>> ', val)
      this.setState({
        [name]: val,
        [`${name}Key`]: findUrlKey(departureOption, val)
      })
    } else {
      // console.log('arrival >>> ', val)
      this.setState({
        [name]: val,
        [`${name}Key`]: findUrlKey(departureOption, val)
      })
    }
  }

  handleArrival = (option, routematch, name) => {
    const { arrival } = this.state

    let data = option.filter(item => {
      return item.value === name
    })

    let Route = []
    Object.entries(routematch).forEach(route => {
      // console.log(route[0])
      if (Number(route[0]) === data[0].id) {
        Route.push(route[1])
      }
    })

    // console.log('handleArrival >>> ', Route, data[0].id)

    let Arrival = []
    let checkArrival = ''

    if (Route.length > 0) {
      Object.values(Route[0]).forEach(value => {
        option.map(item => {
          if (item.id === value) {
            Arrival.push(item)
          }
        })
      })
    }

    if (Arrival.length > 0) {
      const result = Arrival.some(route => {
        return route.label === arrival
      })

      checkArrival = result ? arrival : ''
    }

    this.setState({ arrivalOption: Arrival, arrival: checkArrival })

    console.log('arrival value >>> ', Arrival)
  }

  render() {
    const {
      departureOption,
      arrivalOption,
      departure,
      arrival,
      departureKey,
      arrivalKey,
      routematch
    } = this.state

    const departureList = filterRouteBlank(departureOption, routematch)
    const arrivalList = filterRouteBlank(arrivalOption, routematch)

    // console.log('departureKey >>> ', departureKey)
    // console.log('arrivalKey >>> ', arrivalKey)
    return (
      <Fragment>
        <ImgDiv>
          <img className="_logo" src={KohIcon} alt={KohIcon} />
          <p className="_webText">KOHLIFE.COM</p>
          <p className="_descText">Get cheap tickets across Southeast Asia</p>
          <img className="_vehicleIcon" src={VehicleIcon} alt="VehicleIcon" />
          <br />
          <Autocomplete
            wrapperStyle={{
              display: 'flex',
              width: '100%'
            }}
            getItemValue={item => item.label}
            items={departureList}
            renderInput={props => {
              return (
                <input
                  {...props}
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '50px',
                    borderRadius: '10px 10px 0 0',
                    border: 'solid 1px #e5e5e5',
                    fontSize: '18px',
                    color: '#4a4a4a',
                    fontFamily: 'Roboto',
                    paddingLeft: '16px'
                  }}
                />
              )
            }}
            renderItem={(item, isHighlighted) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    background: isHighlighted ? '#ffc800' : 'white',
                    fontSize: '16px',
                    fontFamily: 'Roboto',
                    color: '#4a4a4a',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </div>
              )
            }}
            value={departure}
            onChange={this.handleChange('departure')}
            onSelect={this.handleSelect('departure')}
          />
          <Autocomplete
            wrapperStyle={{
              display: 'flex',
              width: '100%'
            }}
            getItemValue={item => item.label}
            items={arrivalList}
            renderInput={props => {
              return (
                <input
                  {...props}
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '50px',
                    borderRadius: '0 0 10px 10px',
                    border: 'solid 1px #e5e5e5',
                    fontSize: '18px',
                    color: '#4a4a4a',
                    fontFamily: 'Roboto',
                    paddingLeft: '16px'
                  }}
                />
              )
            }}
            renderItem={(item, isHighlighted) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    background: isHighlighted ? '#ffc800' : 'white',
                    fontSize: '16px',
                    fontFamily: 'Roboto',
                    color: '#4a4a4a',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </div>
              )
            }}
            value={arrival}
            onChange={this.handleChange('arrival')}
            onSelect={this.handleSelect('arrival')}
          />
        </ImgDiv>
      </Fragment>
    )
  }
}

export default KohWidget
