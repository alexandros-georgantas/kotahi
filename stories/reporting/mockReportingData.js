import React from 'react'
import { SparkBar } from '../../app/components/component-reporting/src'

export const generateSystemData = () => {
  return {
    avgPublishTimeDays: 8.765,
    avgReviewTimeDays: 5.678,
    unsubmittedCount: 12,
    submittedCount: 34,
    unassignedCount: 5,
    reviewedCount: 18,
    rejectedCount: 4,
    revisingCount: 9,
    acceptedCount: 5,
    publishedCount: 4,
  }
}

const personNames = [
  'Joe Bloggs',
  'Abigail Avery',
  'Bernard Baker',
  'Calvin Carter',
  'Debbie Duke',
  'Ed Eager',
  'Frances Fitch',
  'Gail Gorey',
  'Hortense Hyatt',
  'Ivor Inders',
  'Jasper Jones',
  'Kathe Koja',
  'Lewis Lee',
  'Martha Mann',
  'Ned Nevis',
  'Oscar Opie',
  'Penny Pinter',
  'Quentin Quell',
  'Rachel Redmond',
  'Sam Suiter',
  'Tom Taylor',
  'Ursula Underwood',
  'Val Vincent',
  'Wayne White',
  'Xanthe Xavier',
  'Yolande Yurginson',
  'Zoe Ziff',
]

const randomInt = max => Math.floor(Math.random() * max)
const lowishRandomInt = max => Math.floor(Math.random() ** 2 * max)
const highishRandomInt = max => Math.floor(Math.random() ** 0.5 * max)
const randomName = () => personNames[randomInt(personNames.length)]

const generateSparkBars = (values, onClick, labelMapper) => {
  const highest = Math.max.apply(null, values)
  return values.map(v => (
    // eslint-disable-next-line react/jsx-key
    <SparkBar
      label={labelMapper && labelMapper(v)}
      onClick={onClick}
      rangeMax={highest}
      value={v}
    />
  ))
}

const navigateFilter = () =>
  (window.location =
    '/iframe.html?id=reporting-table--research-objects&viewMode=story')

export const generateResearchObjectsData = () =>
  personNames.map((name, i) => [
    { content: `${1234 + i}` },
    { content: '2021-05-10' },
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    { content: <a href="#">Manuscript {1234 + i}</a> },
    { content: name },
    { content: `${randomName()}, ${randomName()}` },
    { content: `${randomName()}, ${randomName()}, ${randomName()}` },
    { content: 'Reviewed' },
    { content: '2021-05-23' },
  ])

export const generateEditorsData = () => {
  const names = []
  const assignedCounts = []
  const givenToReviewersCounts = []
  const revisedCounts = []
  const rejectedCounts = []
  const acceptedCounts = []
  const publishedCounts = []

  for (let i = 0; i < 50; i += 1) {
    names.push(randomName())
    const assignedCount = highishRandomInt(40)
    assignedCounts.push(assignedCount)
    const givenToReviewersCount = highishRandomInt(assignedCount + 1)
    givenToReviewersCounts.push(givenToReviewersCount)
    revisedCounts.push(randomInt(givenToReviewersCount + 1))
    const rejectedCount = lowishRandomInt(givenToReviewersCount + 1)
    rejectedCounts.push(rejectedCount)

    const acceptedCount = highishRandomInt(
      givenToReviewersCount - rejectedCount + 1,
    )

    acceptedCounts.push(acceptedCount)
    publishedCounts.push(highishRandomInt(acceptedCount + 1))
  }

  const assignedSparkBars = generateSparkBars(assignedCounts, navigateFilter)

  const givenToReviewersSparkBars = generateSparkBars(
    givenToReviewersCounts,
    navigateFilter,
  )

  const revisedSparkBars = generateSparkBars(revisedCounts, navigateFilter)
  const rejectedSparkBars = generateSparkBars(rejectedCounts, navigateFilter)
  const acceptedSparkBars = generateSparkBars(acceptedCounts, navigateFilter)
  const publishedSparkBars = generateSparkBars(publishedCounts, navigateFilter)

  const result = names.map((name, i) => [
    { content: name },
    { content: assignedSparkBars[i] },
    { content: givenToReviewersSparkBars[i] },
    { content: revisedSparkBars[i] },
    { content: rejectedSparkBars[i] },
    { content: acceptedSparkBars[i] },
    { content: publishedSparkBars[i] },
  ])

  return result
}

export const generateReviewersData = () => {
  const names = []
  const invitedCounts = []
  const declinedCounts = []
  const reviewsCompletedCounts = []
  const avgDurationCounts = []
  const reccAcceptCounts = []
  const reccReviseCounts = []
  const reccRejectCounts = []

  for (let i = 0; i < 50; i += 1) {
    names.push(randomName())
    const invitesCount = lowishRandomInt(8)
    invitedCounts.push(invitesCount)
    const declinedCount = lowishRandomInt(invitesCount + 1)
    declinedCounts.push(declinedCount)

    const reviewsCompletedCount = highishRandomInt(
      invitesCount - declinedCount + 1,
    )

    reviewsCompletedCounts.push(reviewsCompletedCount)
    avgDurationCounts.push(
      reviewsCompletedCount > 0 ? lowishRandomInt(20) / 2 + 0.5 : 0,
    )
    const reccReviseCount = randomInt(reviewsCompletedCount + 1)
    reccReviseCounts.push(reccReviseCount)

    const reccAcceptCount = highishRandomInt(
      reviewsCompletedCount - reccReviseCount + 1,
    )

    reccAcceptCounts.push(reccAcceptCount)
    reccRejectCounts.push(
      reviewsCompletedCount - reccReviseCount - reccAcceptCount,
    )
  }

  const invitedSparkBars = generateSparkBars(invitedCounts, navigateFilter)
  const declinedSparkBars = generateSparkBars(invitedCounts, navigateFilter)

  const reviewsCompletedSparkBars = generateSparkBars(
    reviewsCompletedCounts,
    navigateFilter,
  )

  const avgDurationSparkBars = generateSparkBars(
    avgDurationCounts,
    null,
    count => {
      if (count <= 0) return ''
      if (count === 1) return '1 day'
      return `${count} days`
    },
  )

  const reccAcceptSparkBars = generateSparkBars(
    reccAcceptCounts,
    navigateFilter,
  )

  const reccReviseSparkBars = generateSparkBars(
    reccReviseCounts,
    navigateFilter,
  )

  const reccRejectSparkBars = generateSparkBars(
    reccRejectCounts,
    navigateFilter,
  )

  const result = names.map((name, i) => [
    { content: name },
    { content: invitedSparkBars[i] },
    { content: declinedSparkBars[i] },
    { content: reviewsCompletedSparkBars[i] },
    { content: avgDurationSparkBars[i] },
    { content: reccAcceptSparkBars[i] },
    { content: reccReviseSparkBars[i] },
    { content: reccRejectSparkBars[i] },
  ])

  return result
}

export const generateAuthorsData = () => {
  const names = []
  const unsubmittedCounts = []
  const submittedCounts = []
  const rejectedCounts = []
  const revisionCounts = []
  const acceptedCounts = []
  const publishedCounts = []

  for (let i = 0; i < 50; i += 1) {
    names.push(randomName())
    unsubmittedCounts.push(Math.floor(Math.random() ** 4 * 10))
    const submittedCount = lowishRandomInt(3)
    submittedCounts.push(submittedCount)
    const rejectedCount = lowishRandomInt(submittedCount + 1)
    rejectedCounts.push(rejectedCount)
    revisionCounts.push(randomInt(submittedCount - rejectedCount + 1))
    const acceptedCount = randomInt(submittedCount - rejectedCount + 1)
    acceptedCounts.push(acceptedCount)
    publishedCounts.push(highishRandomInt(acceptedCount + 1))
  }

  const unsubmittedSparkBars = generateSparkBars(
    unsubmittedCounts,
    navigateFilter,
  )

  const submittedSparkBars = generateSparkBars(submittedCounts, navigateFilter)
  const rejectedSparkBars = generateSparkBars(rejectedCounts, navigateFilter)
  const revisionSparkBars = generateSparkBars(revisionCounts, navigateFilter)
  const acceptedSparkBars = generateSparkBars(acceptedCounts, navigateFilter)
  const publishedSparkBars = generateSparkBars(publishedCounts, navigateFilter)

  const result = names.map((name, i) => [
    { content: name },
    { content: unsubmittedSparkBars[i] },
    { content: submittedSparkBars[i] },
    { content: rejectedSparkBars[i] },
    { content: revisionSparkBars[i] },
    { content: acceptedSparkBars[i] },
    { content: publishedSparkBars[i] },
  ])

  return result
}
