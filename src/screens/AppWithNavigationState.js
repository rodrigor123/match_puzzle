import { connect } from 'react-redux'
import AppWithNav from './AppWithNav'

const mapStateToProps = (state) => {
  return {}
}

const AppWithNavigationState = connect(
  mapStateToProps
)(AppWithNav)

export default AppWithNavigationState
