import config from 'config'
import { ClientFunction, Selector, t } from 'testcafe'
import ReactSelector from 'testcafe-react-selectors'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  collabraHome: Selector('nav a'),

  createSubmission: Selector('input'),
  input: Selector('input[type=file]'),
  submitError: Selector('div').withText(
    'There was an error uploading the file',
  ),

  mySubmissionsTitle: Selector('#root div div div div').child(2),
  mySubmissions: Selector('#root div div div div'),
  submission: n => dashboard.mySubmissions.child(n),
  submissionStatus: n =>
    dashboard.mySubmissions
      .child(n)
      .child('div')
      .nth(n),
  submissionSummaryInfoLink: n =>
    dashboard.mySubmissions
      .child(n)
      .find('a')
      .withText('Summary Info'),
  submissionManuscriptLink: n =>
    dashboard.mySubmissions
      .child(n)
      .find('a')
      .withText('Manuscript'),
  submissionDeleteLink: n =>
    dashboard.mySubmissions
      .child(n)
      .find('a')
      .withText('Delete'),
}

export default dashboard
