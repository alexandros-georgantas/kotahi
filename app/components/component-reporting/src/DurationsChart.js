import React from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  height: 300px;
  width: 750px;
`

const generateSeries = data => {
  const reviewSeries = []
  const completionSeries = []

  data.forEach(datum => {
    reviewSeries.push({ x: datum.date, y: 0 })
    reviewSeries.push({ x: datum.date, y: datum.reviewDuration })
    reviewSeries.push(null)
    completionSeries.push({ x: datum.date, y: datum.reviewDuration })
    completionSeries.push({ x: datum.date, y: datum.fullDuration })
    completionSeries.push(null)
  })

  return { reviewSeries, completionSeries }
}

const day = 24 * 60 * 60 * 1000

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const dateFormatter = timestamp => {
  const date = new Date(timestamp)
  return `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}`
}

const getTicks = (startTimestamp, endTimestamp, interval) => {
  const result = []
  let date = new Date(startTimestamp)
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)

  date = new Date(date.getTime() + day)

  while (date.getTime() < endTimestamp) {
    result.push(date.getTime())
    date = new Date(date.getTime() + day)
  }

  return result
}

const DurationsChart = ({
  startDate,
  endDate,
  durationsData,
  reviewAvgsTrace,
  completionAvgsTrace,
}) => {
  const { reviewSeries, completionSeries } = generateSeries(durationsData)

  return (
    <Container>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart height={400} width={500}>
          <XAxis
            allowDataOverflow={false}
            dataKey="x"
            domain={[startDate, endDate]}
            hasTick
            name="date"
            scale="time"
            tickFormatter={dateFormatter}
            ticks={getTicks(startDate, endDate, 7)}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="y"
            name="duration"
            type="number"
            unit=" days"
          />
          <Line
            animationDuration={(1000 * reviewSeries.length) / 12}
            data={reviewSeries}
            dataKey="y"
            dot={false}
            stroke="#ffa900"
            strokeLinejoin="bevel"
            strokeWidth={2}
          />
          <Line
            animationBegin={1000}
            animationDuration={(1000 * completionSeries.length) / 12}
            data={completionSeries}
            dataKey="y"
            dot={false}
            stroke="#475ae8"
            strokeLinejoin="bevel"
            strokeWidth={2}
          />
          <Line
            animationBegin={1800}
            animationDuration={1000}
            data={reviewAvgsTrace}
            dataKey="y"
            dot={false}
            stroke="#ffa900"
            strokeLinejoin="bevel"
            strokeOpacity={0.4}
            type="monotone"
          />
          <Line
            animationBegin={1800}
            animationDuration={1000}
            data={completionAvgsTrace}
            dataKey="y"
            dot={false}
            stroke="#475ae8"
            strokeLinejoin="bevel"
            strokeOpacity={0.4}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  )
}

DurationsChart.propTypes = {
  /** Start of date (x) axis, ms since epoch */
  startDate: PropTypes.number.isRequired,
  /** End of date (x) axis, ms since epoch */
  endDate: PropTypes.number.isRequired,
  /** Manuscripts expressed as an array of {date, reviewDuration, fullDuration},
   * where date is submitted datetime (ms since epoch),
   * reviewDuration is days from submission until last review completed (or null if reviews still pending),
   * and completionDuration is days from submission until either the most recent publication date or rejection date (or null if not published or rejected) */
  durationsData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number.isRequired,
      reviewDuration: PropTypes.number,
      fullDuration: PropTypes.number,
    }).isRequired,
  ).isRequired,
  /** x,y coordinates for a continuous trace showing running average review durations */
  reviewAvgsTrace: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  ).isRequired,
  /** x,y coordinates for a continuous trace showing running average completion (published or rejected) durations */
  completionAvgsTrace: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default DurationsChart
