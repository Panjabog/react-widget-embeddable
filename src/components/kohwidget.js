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
      ['label']: name
    }
  })

  return loc
}

class KohWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      departureOption: [],
      arrivalOption: []
    }
  }

  componentDidMount() {
    axios
      .get(
        `https://82ywqgk2ik.execute-api.ap-southeast-1.amazonaws.com/dev/locations/searchbox`
      )
      .then(res => {
        const data = res.data
        console.log('locations data >>> ', data.message)

        if (data.status) {
          this.setState({
            departureOption: departureData(data.message),
            arrivalOption: departureData(data.message)
          })
        }
      })
  }

  render() {
    const { departureOption, arrivalOption } = this.state

    console.log('departureOption >>> ', departureOption)
    console.log('arrivalOption >>> ', arrivalOption)
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
            items={departureOption}
            renderInput={props => {
              return (
                <input
                  {...props}
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '50px',
                    borderRadius: '10px 10px 0 0',
                    border: 'solid 1px #e5e5e5'
                  }}
                />
              )
            }}
            renderItem={(item, isHighlighted) => (
              <div
                style={{ background: isHighlighted ? 'lightgray' : 'white' }}
              >
                {item.label}
              </div>
            )}
            value={this.state.value}
            onChange={e => (value = e.target.value)}
            onSelect={val => (value = val)}
          />
          <Autocomplete
            wrapperStyle={{
              display: 'flex',
              width: '100%'
            }}
            getItemValue={item => item.label}
            items={departureOption}
            renderInput={props => {
              return (
                <input
                  {...props}
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '50px',
                    borderRadius: '0 0 10px 10px',
                    border: 'solid 1px #e5e5e5'
                  }}
                />
              )
            }}
            renderItem={(item, isHighlighted) => (
              <div
                style={{ background: isHighlighted ? 'lightgray' : 'white' }}
              >
                {item.label}
              </div>
            )}
            value={this.state.value}
            onChange={e => (value = e.target.value)}
            onSelect={val => (value = val)}
          />
        </ImgDiv>
      </Fragment>
    )
  }
}

export default KohWidget
