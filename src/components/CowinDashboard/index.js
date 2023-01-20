import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    isApiStatusActive: apiStatusConstants.initial,
    fecthedData: [],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const responce = await fetch('https://apis.ccbp.in/covid-vaccination-ata')
    this.setState({isApiStatusActive: apiStatusConstants.inProgress})
    if (responce.ok === true) {
      const data = await responce.json()
      console.log(data)

      const updateData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachItem => ({
          vaccineDate: eachItem.vaccine_date,
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        fecthedData: updateData,
        isApiStatusActive: apiStatusConstants.success,
      })
    } else {
      this.setState({isApiStatusActive: apiStatusConstants.failure})
    }
  }

  laodingView = () => (
    <div>
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
      />
    </div>
  )

  renderCowin = () => {
    const {fecthedData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = fecthedData
    const {vaccineDate} = last7DaysVaccination
    console.log(fecthedData)
    console.log(vaccineDate)

    return (
      <div className="bg-container">
        <div className="logo-headingg">
          <img
            className="image"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="heading">Co-Win</h1>
        </div>
        <h1 className="heading">Cowin Vaccination in India</h1>
        <VaccinationCoverage last7Details={last7DaysVaccination} />

        <h1 className="heading">Vaccination by gender</h1>
        <VaccinationByGender genderDetails={vaccinationByGender} />
        <h1 className="heading">Vaccination by Age</h1>

        <VaccinationByAge ageDetails={vaccinationByAge} />
      </div>
    )
  }

  render() {
    const {isApiStatusActive} = this.state
    switch (isApiStatusActive) {
      case apiStatusConstants.success:
        return this.renderCowin()
      case apiStatusConstants.inProgress:
        return this.laodingView()
      case isApiStatusActive.failure:
        return this.failureView()

      default:
        return null
    }
  }
}

export default CowinDashboard
