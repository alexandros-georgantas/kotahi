// This should return an object with front matter for the publication that should be sent to the PDF or to JATS.
//
// this should pull (and be supplanted by) in a user version from config/journal/exportsettings/publicationMetadata.js

let userPublicationMetadata = {}

try {
  userPublicationMetadata = require('../../../config/journal/export/journalMetadata.json')
} catch {
  console.error("userPublicationMetadata doesn't exist.")
}

const publicationMetadata = {
  journalId: [
    { type: 'pmc', value: 'BMJ' },
    { type: 'publisher', value: 'BR MED J' },
  ],
  journalTitle: 'Journal Title',
  abbrevJournalTitle: 'Jour.Ti.',
  issn: [
    { type: 'print', value: '1063-777X' },
    { type: 'electronic', value: '1090-6517' },
  ],
  copyright: { name: 'name', description: 'description', year: 'year' },
  publisher: { publisherName: 'elife' },
  articleIdOnWebsite: 'x456789',
  publisherLogo:
    '' ||
    `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTM2cHgiIGhlaWdodD0iNTFweCIgdmlld0JveD0iMCAwIDEzNiA1MSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNjMuMSAoOTI0NTIpIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPmVsaWZlLWxvZ28teHM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iZWxpZmUtbG9nby14cyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgZmlsbD0iI0ZGRkZGRiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEzNiIgaGVpZ2h0PSI1MSI+PC9yZWN0PgogICAgICAgIDxnIGlkPSJsb2dvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9InN5bWJvbCI+CiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBzdHJva2U9IiNCRUMzQzUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iI0ZGRkZGRiIgY3g9IjIxLjUiIGN5PSIyMS41IiByPSIyMC41Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOC40NTQxLDE4LjQ1NDM1IEMxOS41NDgxLDE5LjU0ODM1IDIxLjMzODEsMTkuNTQ4MzUgMjIuNDMxNiwxOC40NTQzNSBMMzIuNzI0Niw4LjE2MTg1IEMzMS4yNTQxLDYuOTA5MzUgMjkuNTc0Niw1Ljg5ODM1IDI3Ljc0NTYsNS4xODU4NSBMMTguNDU0MSwxNC40NzY4NSBDMTcuMzYwMSwxNS41NzA4NSAxNy4zNjAxLDE3LjM2MDM1IDE4LjQ1NDEsMTguNDU0MzUiIGlkPSJGaWxsLTIiIGZpbGw9IiM3Q0IxM0YiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNC40MjA0LDI0LjQyMDY1IEMyNS41MTQ0LDI1LjUxNDY1IDI1LjUxNDQsMjcuMzA0MTUgMjQuNDIwNCwyOC4zOTgxNSBMMTYuNDY1NCwzNi4zNTMxNSBDMTUuMzcxNCwzNy40NDY2NSAxMy41ODE5LDM3LjQ0NjY1IDEyLjQ4NzksMzYuMzUzMTUgQzExLjM5MzksMzUuMjU5MTUgMTEuMzkzOSwzMy40Njk2NSAxMi40ODc5LDMyLjM3NTY1IEwyMC40NDI5LDI0LjQyMDY1IEMyMS41MzY0LDIzLjMyNjY1IDIzLjMyNjQsMjMuMzI2NjUgMjQuNDIwNCwyNC40MjA2NSIgaWQ9IkZpbGwtNCIgZmlsbD0iI0Q3MUQ2MiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2LjQ2NTM1LDIwLjQ0MzEgQzE3LjU1OTM1LDIxLjUzNzEgMTcuNTU5MzUsMjMuMzI3MSAxNi40NjUzNSwyNC40MjA2IEMxNS4zNzEzNSwyNS41MTQ2IDEzLjU4MTg1LDI1LjUxNDYgMTIuNDg3ODUsMjQuNDIwNiBDMTEuMzkzODUsMjMuMzI3MSAxMS4zOTM4NSwyMS41MzcxIDEyLjQ4Nzg1LDIwLjQ0MzEgQzEzLjU4MTg1LDE5LjM0OTEgMTUuMzcxMzUsMTkuMzQ5MSAxNi40NjUzNSwyMC40NDMxIiBpZD0iRmlsbC02IiBmaWxsPSIjMzM2QTJEIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjYuNDA5MiwxMC40OTk1IEMyNy41MDMyLDExLjU5MzUgMjcuNTAzMiwxMy4zODMgMjYuNDA5MiwxNC40NzcgQzI1LjMxNTIsMTUuNTcxIDIzLjUyNTIsMTUuNTcxIDIyLjQzMTcsMTQuNDc3IEMyMS4zMzc3LDEzLjM4MyAyMS4zMzc3LDExLjU5MzUgMjIuNDMxNywxMC40OTk1IEMyMy41MjUyLDkuNDA1NSAyNS4zMTUyLDkuNDA1NSAyNi40MDkyLDEwLjQ5OTUiIGlkPSJGaWxsLTgiIGZpbGw9IiMzMzZBMkQiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOC40NTQxLDMwLjM4NjcgQzE5LjU0ODEsMzEuNDgwNyAxOS41NDgxLDMzLjI3MDcgMTguNDU0MSwzNC4zNjQyIEMxNy4zNjAxLDM1LjQ1ODIgMTUuNTcwMSwzNS40NTgyIDE0LjQ3NjYsMzQuMzY0MiBDMTMuMzgyNiwzMy4yNzA3IDEzLjM4MjYsMzEuNDgwNyAxNC40NzY2LDMwLjM4NjcgQzE1LjU3MDEsMjkuMjkyNyAxNy4zNjAxLDI5LjI5MjcgMTguNDU0MSwzMC4zODY3IiBpZD0iRmlsbC0xMCIgZmlsbD0iIzg2MTQ1MCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM2LjM1MzA1LDEyLjQ4ODMgQzM3LjQ0NzA1LDEzLjU4MjMgMzcuNDQ3MDUsMTUuMzcxOCAzNi4zNTMwNSwxNi40NjU4IEMzNS4yNTkwNSwxNy41NTk4IDMzLjQ2OTA1LDE3LjU1OTggMzIuMzc1NTUsMTYuNDY1OCBDMzEuMjgxNTUsMTUuMzcxOCAzMS4yODE1NSwxMy41ODIzIDMyLjM3NTU1LDEyLjQ4ODMgQzMzLjQ2OTA1LDExLjM5NDMgMzUuMjU5MDUsMTEuMzk0MyAzNi4zNTMwNSwxMi40ODgzIiBpZD0iRmlsbC0xMiIgZmlsbD0iIzg2MTQ1MCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTMwLjM4Njc1LDE4LjQ1NDM1IEMzMS40ODA3NSwxOS41NDgzNSAzMS40ODA3NSwyMS4zMzgzNSAzMC4zODY3NSwyMi40MzE4NSBDMjkuMjkyNzUsMjMuNTI1ODUgMjcuNTAyNzUsMjMuNTI1ODUgMjYuNDA5MjUsMjIuNDMxODUgQzI1LjMxNTI1LDIxLjMzODM1IDI1LjMxNTI1LDE5LjU0ODM1IDI2LjQwOTI1LDE4LjQ1NDM1IEMyNy41MDI3NSwxNy4zNjAzNSAyOS4yOTI3NSwxNy4zNjAzNSAzMC4zODY3NSwxOC40NTQzNSIgaWQ9IkZpbGwtMTQiIGZpbGw9IiNENzFENjIiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zMi4zNzU1LDI4LjM5ODIgQzMzLjQ2OTUsMjkuNDkyMiAzMy40Njk1LDMxLjI4MTcgMzIuMzc1NSwzMi4zNzU3IEMzMS4yODE1LDMzLjQ2OTcgMjkuNDkxNSwzMy40Njk3IDI4LjM5OCwzMi4zNzU3IEMyNy4zMDQsMzEuMjgxNyAyNy4zMDQsMjkuNDkyMiAyOC4zOTgsMjguMzk4MiBDMjkuNDkxNSwyNy4zMDQyIDMxLjI4MTUsMjcuMzA0MiAzMi4zNzU1LDI4LjM5ODIiIGlkPSJGaWxsLTE2IiBmaWxsPSIjMjk5NEQyIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTYuNDY1MzUsOC41MTA3NSBDMTcuNTU5MzUsOS42MDQ3NSAxNy41NTkzNSwxMS4zOTQyNSAxNi40NjUzNSwxMi40ODgyNSBDMTUuMzcxMzUsMTMuNTgyMjUgMTMuNTgxODUsMTMuNTgyMjUgMTIuNDg3ODUsMTIuNDg4MjUgQzExLjM5Mzg1LDExLjM5NDI1IDExLjM5Mzg1LDkuNjA0NzUgMTIuNDg3ODUsOC41MTA3NSBDMTMuNTgxODUsNy40MTY3NSAxNS4zNzEzNSw3LjQxNjc1IDE2LjQ2NTM1LDguNTEwNzUiIGlkPSJGaWxsLTE4IiBmaWxsPSIjMDg1ODlCIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTAuNDk5NSwyNi40MDk0IEM5LjQwNTUsMjUuMzE1NCA3LjYxNTUsMjUuMzE1NCA2LjUyMiwyNi40MDk0IEw1LjE4NTUsMjcuNzQ1NCBDNS44OTgsMjkuNTc0OSA2LjkwOSwzMS4yNTM5IDguMTYxNSwzMi43MjQ0IEwxMC40OTk1LDMwLjM4NjkgQzExLjU5MzUsMjkuMjkyOSAxMS41OTM1LDI3LjUwMzQgMTAuNDk5NSwyNi40MDk0IiBpZD0iRmlsbC0yMCIgZmlsbD0iIzg2MTQ1MCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE4LjQ1NDEsNi41MjE5NSBDMTkuNTQ4MSw3LjYxNTk1IDIxLjMzODEsNy42MTU5NSAyMi40MzE2LDYuNTIxOTUgTDI0LjQyMDYsNC41MzI5NSBDMjQuNDk0MSw0LjQ1OTQ1IDI0LjU1MDYsNC4zNzU0NSAyNC42MTQxLDQuMjk1NDUgQzIzLjU4MzYsNC4xMDQ5NSAyMi41MjI2LDMuOTk5OTUgMjEuNDM3NiwzLjk5OTk1IEMyMC4xMzQ2LDMuOTk5OTUgMTguODY2Niw0LjE0Nzk1IDE3LjY0NDYsNC40MjA0NSBDMTcuNjE0MSw1LjE3ODQ1IDE3Ljg3ODYsNS45NDY0NSAxOC40NTQxLDYuNTIxOTUiIGlkPSJGaWxsLTIyIiBmaWxsPSIjRDcxRDYyIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTAuNDk5NSwxOC40NTQzNSBDMTEuNTkzNSwxNy4zNjAzNSAxMS41OTM1LDE1LjU3MDg1IDEwLjQ5OTUsMTQuNDc2ODUgQzkuNDA1NSwxMy4zODI4NSA3LjYxNTUsMTMuMzgyODUgNi41MjIsMTQuNDc2ODUgTDQuODA3NSwxNi4xOTA4NSBDNC4yODQsMTcuODQ3ODUgNCwxOS42MDk4NSA0LDIxLjQzNzM1IEM0LDIyLjM2MTg1IDQuMDczNSwyMy4yNjkzNSA0LjIxMywyNC4xNTUzNSBDNC42OTUsMjQuMDM3MzUgNS4xNTMsMjMuODAwODUgNS41Mjc1LDIzLjQyNjM1IEwxMC40OTk1LDE4LjQ1NDM1IFoiIGlkPSJGaWxsLTI0IiBmaWxsPSIjMjk5NEQyIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzQuMzY0MjUsMjIuNDMxOSBDMzMuMjcwMjUsMjMuNTI1OSAzMy4yNzAyNSwyNS4zMTU0IDM0LjM2NDI1LDI2LjQwOTQgQzM1LjM3OTc1LDI3LjQyNDkgMzYuOTg4NzUsMjcuNDg0OSAzOC4wOTAyNSwyNi42MTQ0IEMzOC42MDAyNSwyNC45Nzc5IDM4Ljg3NDc1LDIzLjIzOTQgMzguODc0NzUsMjEuNDM3NCBDMzguODc0NzUsMjAuMzUxOSAzOC43NzAyNSwxOS4yOTE0IDM4LjU3OTc1LDE4LjI2MDQgQzM4LjQ5OTc1LDE4LjMyNDQgMzguNDE1NzUsMTguMzgwNCAzOC4zNDE3NSwxOC40NTQ0IEwzNC4zNjQyNSwyMi40MzE5IFoiIGlkPSJGaWxsLTI2IiBmaWxsPSIjMDg1ODlCIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjYuNDA5MiwzNC4zNjQyNSBDMjUuMzE1MiwzMy4yNzAyNSAyMy41MjUyLDMzLjI3MDI1IDIyLjQzMTcsMzQuMzY0MjUgTDE4LjQ1NDIsMzguMzQxNzUgQzE4LjM4MDIsMzguNDE1NzUgMTguMzI0MiwzOC40OTk3NSAxOC4yNjAyLDM4LjU3OTc1IEMxOS4yOTEyLDM4Ljc3MDI1IDIwLjM1MjIsMzguODc0NzUgMjEuNDM3NywzOC44NzQ3NSBDMjMuMjM5MiwzOC44NzQ3NSAyNC45NzgyLDM4LjYwMDI1IDI2LjYxNDIsMzguMDkwNzUgQzI3LjQ4NDcsMzYuOTg5MjUgMjcuNDI0NywzNS4zODAyNSAyNi40MDkyLDM0LjM2NDI1IiBpZD0iRmlsbC0yOCIgZmlsbD0iIzdDQjEzRiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDxnIGlkPSJsZXR0ZXJzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ny41MDAwMDAsIDYuMzcxODAwKSIgZmlsbD0iIzY2NkI2RSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOS44MzQsMTEuNDQyNyBDOC42OTc1LDExLjQ0MjcgNy44MDY1LDExLjgwMzIgNy4xNjIsMTIuNTIzNyBDNi41MTc1LDEzLjI0NDcgNi4xNDg1LDE0LjI2NjcgNi4wNTQ1LDE1LjU5MTIgTDEzLjU3OCwxNS41OTEyIEMxMy41NTQ1LDE0LjI2NjcgMTMuMjA5LDEzLjI0NDcgMTIuNTQxLDEyLjUyMzcgQzExLjg3MywxMS44MDMyIDEwLjk3MDUsMTEuNDQyNyA5LjgzNCwxMS40NDI3IE0xMC41OSwyOC4wMDEyIEM3LjQyNiwyOC4wMDEyIDQuOTUzLDI3LjEyODIgMy4xNzIsMjUuMzgyMiBDMS4zOTA1LDIzLjYzNjIgMC41LDIxLjE2MzIgMC41LDE3Ljk2NDIgQzAuNSwxNC42NzEyIDEuMzIzNSwxMi4xMjUyIDIuOTY5NSwxMC4zMjY3IEM0LjYxNiw4LjUyNzcgNi44OTI1LDcuNjI4MiA5Ljc5OSw3LjYyODIgQzEyLjU3Niw3LjYyODIgMTQuNzM4NSw4LjQxOTIgMTYuMjg1LDEwLjAwMTIgQzE3LjgzMiwxMS41ODMyIDE4LjYwNTUsMTMuNzY4NyAxOC42MDU1LDE2LjU1NzcgTDE4LjYwNTUsMTkuMTU5NyBMNS45MzE1LDE5LjE1OTcgQzUuOTkwNSwyMC42ODI3IDYuNDQxNSwyMS44NzIyIDcuMjg1LDIyLjcyNzcgQzguMTI5LDIzLjU4MzIgOS4zMTI1LDI0LjAxMTIgMTAuODM2LDI0LjAxMTIgQzEyLjAxOTUsMjQuMDExMiAxMy4xMzg1LDIzLjg4ODIgMTQuMTkzNSwyMy42NDE3IEMxNS4yNDgsMjMuMzk1NyAxNi4zNDk1LDIzLjAwMzIgMTcuNDk4LDIyLjQ2NDIgTDE3LjQ5OCwyNi42MTI3IEMxNi41NjA1LDI3LjA4MTIgMTUuNTU4NSwyNy40MzAyIDE0LjQ5MiwyNy42NTg3IEMxMy40MjYsMjcuODg3MiAxMi4xMjUsMjguMDAxMiAxMC41OSwyOC4wMDEyIiBpZD0iRmlsbC0zMiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IkZpbGwtMzQiIHBvaW50cz0iMjEuNSAyNy42MjgyIDIxLjUgMi42MjgyIDI2LjUgMi42MjgyIDI2LjUgMjMuNjI4MiAzNi41IDIzLjYyODIgMzYuNSAyNy42MjgyIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzkuNSwyNy42MjgyIEw0NC41LDI3LjYyODIgTDQ0LjUsOC42MjgyIEwzOS41LDguNjI4MiBMMzkuNSwyNy42MjgyIFogTTM5LjUsNC4xMjAxMTQgQzM5LjUsMi40NTg2Nzk0NSA0MC4zMzM2MTg5LDEuNjI4MiA0MiwxLjYyODIgQzQzLjY2NjgwOTUsMS42MjgyIDQ0LjUsMi40NTg2Nzk0NSA0NC41LDQuMTIwMTE0IEM0NC41LDQuOTExNTkwNDEgNDQuMjkxODA5NSw1LjUyNzU1MzEyIDQzLjg3NSw1Ljk2NzUyNjQ4IEM0My40NTg2MTg5LDYuNDA3OTc1NDkgNDIuODMzNjE4OSw2LjYyODIgNDIsNi42MjgyIEM0MC4zMzM2MTg5LDYuNjI4MiAzOS41LDUuNzkyMDEyNzkgMzkuNSw0LjEyMDExNCBMMzkuNSw0LjEyMDExNCBaIiBpZD0iRmlsbC0zNiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYwLjUsMTIuNjI4MiBMNTUuNSwxMi42MjgyIEw1NS41LDI3LjYyODIgTDUwLjUsMjcuNjI4MiBMNTAuNSwxMi42MjgyIEw0Ny41LDEyLjYyODIgTDQ3LjUsOS42MjgyIEw1MC41LDguNjI4MiBMNTAuNSw3LjYyODIgQzUwLjUsNS4zOTAyIDUxLjEwNzUsMy4yMDYyIDUyLjIwOSwyLjE3NTIgQzUzLjMxMDUsMS4xNDM3IDU1LjA3NCwwLjYyODIgNTcuNSwwLjYyODIgQzU5LjM1MTUsMC42MjgyIDYwLjk5OCwwLjkwMzcgNjIuNDM5NSwxLjQ1NDIgTDYwLjk4ODUsNS4xMzc3IEM1OS45MSw0Ljc5ODIgNTguNDE0LDQuNjI4MiA1Ny41LDQuNjI4MiBDNTYuNzM4NSw0LjYyODIgNTYuMTg3NSw0Ljg1MzcgNTUuODQ3NSw1LjMwNDcgQzU1LjUwOCw1Ljc1NjIgNTUuNSw2LjkyNTIgNTUuNSw3LjYyODIgTDU1LjUsOC42MjgyIEw2MC41LDguNjI4MiBMNjAuNSwxMi42MjgyIFoiIGlkPSJGaWxsLTM4Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNzEuODM0LDExLjQ0MjcgQzcwLjY5NzUsMTEuNDQyNyA2OS44MDY1LDExLjgwMzIgNjkuMTYyLDEyLjUyMzcgQzY4LjUxNzUsMTMuMjQ0NyA2OC4xNDg1LDE0LjI2NjcgNjguMDU0NSwxNS41OTEyIEw3NS41NzgsMTUuNTkxMiBDNzUuNTU0NSwxNC4yNjY3IDc1LjIwOSwxMy4yNDQ3IDc0LjU0MSwxMi41MjM3IEM3My44NzMsMTEuODAzMiA3Mi45NzA1LDExLjQ0MjcgNzEuODM0LDExLjQ0MjcgTTcyLjU5LDI4LjAwMTIgQzY5LjQyNiwyOC4wMDEyIDY2Ljk1MywyNy4xMjgyIDY1LjE3MiwyNS4zODIyIEM2My4zOTA1LDIzLjYzNjIgNjIuNSwyMS4xNjMyIDYyLjUsMTcuOTY0MiBDNjIuNSwxNC42NzEyIDYzLjMyMzUsMTIuMTI1MiA2NC45Njk1LDEwLjMyNjcgQzY2LjYxNiw4LjUyNzcgNjguODkyNSw3LjYyODIgNzEuNzk5LDcuNjI4MiBDNzQuNTc2LDcuNjI4MiA3Ni43Mzg1LDguNDE5MiA3OC4yODUsMTAuMDAxMiBDNzkuODMyLDExLjU4MzIgODAuNjA1NSwxMy43Njg3IDgwLjYwNTUsMTYuNTU3NyBMODAuNjA1NSwxOS4xNTk3IEw2Ny45MzE1LDE5LjE1OTcgQzY3Ljk5MDUsMjAuNjgyNyA2OC40NDE1LDIxLjg3MjIgNjkuMjg1LDIyLjcyNzcgQzcwLjEyOSwyMy41ODMyIDcxLjMxMjUsMjQuMDExMiA3Mi44MzYsMjQuMDExMiBDNzQuMDE5NSwyNC4wMTEyIDc1LjEzODUsMjMuODg4MiA3Ni4xOTM1LDIzLjY0MTcgQzc3LjI0OCwyMy4zOTU3IDc4LjM0OTUsMjMuMDAzMiA3OS40OTgsMjIuNDY0MiBMNzkuNDk4LDI2LjYxMjcgQzc4LjU2MDUsMjcuMDgxMiA3Ny41NTg1LDI3LjQzMDIgNzYuNDkyLDI3LjY1ODcgQzc1LjQyNiwyNy44ODcyIDc0LjEyNSwyOC4wMDEyIDcyLjU5LDI4LjAwMTIiIGlkPSJGaWxsLTM5Ij48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==`, // this should be base64
  openAccessLogo: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjY0MCIKICAgaGVpZ2h0PSIxMDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxNCIKICAgc29kaXBvZGk6ZG9jbmFtZT0iT3Blbl9BY2Nlc3NfbG9nb19QTG9TX2dyYXkuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTgiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTciCiAgICAgaWQ9Im5hbWVkdmlldzE2IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIwLjIzNiIKICAgICBpbmtzY2FwZTpjeD0iLTIwNy41NDIzNyIKICAgICBpbmtzY2FwZTpjeT0iNTAwIgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcxNCIgLz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzpjcmVhdG9yPmFydCBkZXNpZ25lciBhdCBQTG9TLCBtb2RpZmllZCBieSBXaWtpcGVkaWEgdXNlcnMgTmluYSwgQmVhbywgSmFrb2JWb3NzLCBhbmQgQW5vbk1vb3M8L2RjOmNyZWF0b3I+CiAgICAgICAgPGRjOmRlc2NyaXB0aW9uPk9wZW4gQWNjZXNzIGxvZ28sIGNvbnZlcnRlZCBpbnRvIHN2ZywgZGVzaWduZWQgYnkgUExvUy4gVGhpcyB2ZXJzaW9uIHdpdGggdHJhbnNwYXJlbnQgYmFja2dyb3VuZC48L2RjOmRlc2NyaXB0aW9uPgogICAgICAgIDxkYzpzb3VyY2U+aHR0cDovL2NvbW1vbnMud2lraW1lZGlhLm9yZy93aWtpL0ZpbGU6T3Blbl9BY2Nlc3NfbG9nb19QTG9TX3doaXRlLnN2ZzwvZGM6c291cmNlPgogICAgICAgIDxkYzpsaWNlbnNlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvIiAvPgogICAgICAgIDxjYzpsaWNlbnNlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvIiAvPgogICAgICAgIDxjYzphdHRyaWJ1dGlvbk5hbWU+YXJ0IGRlc2lnbmVyIGF0IFBMb1MsIG1vZGlmaWVkIGJ5IFdpa2lwZWRpYSB1c2VycyBOaW5hLCBCZWFvLCBKYWtvYlZvc3MsIGFuZCBBbm9uTW9vczwvY2M6YXR0cmlidXRpb25OYW1lPgogICAgICAgIDxjYzphdHRyaWJ1dGlvblVSTD5odHRwOi8vd3d3LnBsb3Mub3JnLzwvY2M6YXR0cmlidXRpb25VUkw+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxyZWN0CiAgICAgd2lkdGg9IjY0MCIKICAgICBoZWlnaHQ9IjEwMDAiCiAgICAgZmlsbD0iI2ZmZmZmZiIKICAgICBpZD0icmVjdDQiIC8+CiAgPGcKICAgICBzdHJva2U9IiNmNjgyMTIiCiAgICAgc3Ryb2tlLXdpZHRoPSIxMDQuNzY0IgogICAgIGZpbGw9Im5vbmUiCiAgICAgaWQ9ImcxMCIKICAgICBzdHlsZT0ic3Ryb2tlOiM5ZTlhOTg7c3Ryb2tlLW9wYWNpdHk6MSI+CiAgICA8cGF0aAogICAgICAgZD0iTTExMS4zODcsMzA4LjEzNVYyNzIuNDA4QTIwOS4yMSwyMDkuMjE0IDAgMCwxIDUyOS44MDcsMjcyLjQwOFY1MzAuODM0IgogICAgICAgaWQ9InBhdGg2IgogICAgICAgc3R5bGU9InN0cm9rZTojOWU5YTk4O3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgICA8Y2lyY2xlCiAgICAgICBjeD0iMzIwLjAwNCIKICAgICAgIGN5PSI2ODAuNzI5IgogICAgICAgcj0iMjU2LjA4MyIKICAgICAgIGlkPSJjaXJjbGU4IgogICAgICAgc3R5bGU9InN0cm9rZTojOWU5YTk4O3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgPC9nPgogIDxjaXJjbGUKICAgICBmaWxsPSIjZjY4MjEyIgogICAgIGN4PSIzMjEuMDEiCiAgICAgY3k9IjY4MS42NTkiCiAgICAgcj0iODYuNDI4NyIKICAgICBpZD0iY2lyY2xlMTIiCiAgICAgc3R5bGU9ImZpbGw6IzllOWE5ODtmaWxsLW9wYWNpdHk6MSIgLz4KPC9zdmc+Cg==
`, // this should be base64
  // This should probably be a URL! It should probably be a local URL!
  copyrightLogo: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMTYuNzQ1NzQxbW0iCiAgIGhlaWdodD0iMTYuNzY5MDJtbSIKICAgdmlld0JveD0iMCAwIDE2Ljc0NTc0MSAxNi43NjkwMiIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnODM0IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJjY19sb2dvX2dyYXkuc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzODI4IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSIxLjk3OTg5OSIKICAgICBpbmtzY2FwZTpjeD0iOTcuMDU1OTk3IgogICAgIGlua3NjYXBlOmN5PSI1MS42ODk0ODciCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTciCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTgzMSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTg3LjYzMzA4NCwtMTQ1Ljc0MDQ5KSI+CiAgICA8cGF0aAogICAgICAgaWQ9InBhdGg0MCIKICAgICAgIHN0eWxlPSJjbGlwLXJ1bGU6ZXZlbm9kZDtvdmVyZmxvdzp2aXNpYmxlO2ZpbGw6IzllOWE5ODtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2Utd2lkdGg6MC4yNjQ1ODMzMiIKICAgICAgIGQ9Im0gMTAwLjc0NjM2LDE1Mi43MzE4NCBjIC0wLjQ3Mzg3LC0wLjg2MzYgLTEuMjgxNjQzLC0xLjIwNzMgLTIuMjE5NTksLTEuMjA3MyAtMS4zNjUyNSwwIC0yLjQ1MjE1OCwwLjk2NTczIC0yLjQ1MjE1OCwyLjYwMDU5IDAsMS42NjIzOCAxLjAyMTgyLDIuNjAwNTkgMi40OTg0NiwyLjYwMDU5IDAuOTQ3NDczLDAgMS43NTUyNDgsLTAuNTIwMTcgMi4yMDEwNjgsLTEuMzA5NDIgbCAtMS4wNDAzNDEsLTAuNTI5NDMgYyAtMC4yMzIwNCwwLjU1NzIxIC0wLjU4NDk5NCwwLjcyNDQzIC0xLjAzMDgxNywwLjcyNDQzIC0wLjc3MDczMSwwIC0xLjEyMzk1LC0wLjY0MDgyIC0xLjEyMzk1LC0xLjQ4NTkgMCwtMC44NDUwOCAwLjI5NzM5MiwtMS40ODYxNyAxLjEyMzk1LC0xLjQ4NjE3IDAuMjIyNzc5LDAgMC42Njg2MDIsMC4xMjA5MiAwLjkyODk1MiwwLjY3Nzg2IHogbSAtNC44MzcxMTMsMCBjIC0wLjQ3MzYwNCwtMC44NjM2IC0xLjI4MTY0MiwtMS4yMDczIC0yLjIxOTU5LC0xLjIwNzMgLTEuMzY1MjUsMCAtMi40NTE4OTMsMC45NjU3MyAtMi40NTE4OTMsMi42MDA1OSAwLDEuNjYyMzggMS4wMjE1NTYsMi42MDA1OSAyLjQ5ODQ2LDIuNjAwNTkgMC45NDc0NzMsMCAxLjc1NTI0NiwtMC41MjAxNyAyLjIwMTA2OSwtMS4zMDk0MiBsIC0xLjA0MDM0MiwtMC41Mjk0MyBjIC0wLjIzMjMwNCwwLjU1NzIxIC0wLjU4NDk5NCwwLjcyNDQzIC0xLjAzMDgxNiwwLjcyNDQzIC0wLjc3MDk5NiwwIC0xLjEyMzY4NiwtMC42NDA4MiAtMS4xMjM2ODYsLTEuNDg1OSAwLC0wLjg0NTA4IDAuMjk3MTI3LC0xLjQ4NjE3IDEuMTIzNjg2LC0xLjQ4NjE3IDAuMjIyNzc5LDAgMC42Njg2MDIsMC4xMjA5MiAwLjkyODY4NywwLjY3Nzg2IHogbSAwLjA4NTIsLTYuOTkxMzUgYyAtMi4yOTcxMTMsMCAtNC4zMTg1MjksMC44NTAxIC01Ljg4MDYyOSwyLjQzNDk2IC0xLjYwNzg3MywxLjYzMTE1IC0yLjQ4MDczNCwzLjc0NDM4IC0yLjQ4MDczNCw1Ljk0OTY4IDAsMi4yMjgwNiAwLjg0OTg0Miw0LjI5NTUxIDIuNDU3OTgsNS45MDM2NSAxLjYwNzg3MiwxLjYwNzg3IDMuNjk4MzQ1LDIuNDgwNzMgNS45MDMzODMsMi40ODA3MyAyLjIwNTAzNywwIDQuMzQxNTQzLC0wLjg3Mjg2IDUuOTk1NDUzLC0yLjUwMzc1IDEuNTYyMSwtMS41MzkwOCAyLjM4ODkyLC0zLjU4MzUyIDIuMzg4OTIsLTUuODgwNjMgMCwtMi4yNzQwOSAtMC44MjY4MiwtNC4zNDE1NSAtMi40MTE5NCwtNS45MjY2NiAtMS42MDc4NywtMS42MDc4OCAtMy42NzUzMjEsLTIuNDU3OTggLTUuOTcyNDMzLC0yLjQ1Nzk4IHogbSAwLjAyMzAyLDEuNTE2MzIgYyAxLjg4MzU2OCwwIDMuNTYwNDk3LDAuNzEyIDQuODY5OTEzLDIuMDIxNDIgMS4yODYxNCwxLjI4NjQgMS45NzUzOCwyLjk4NjM1IDEuOTc1MzgsNC44NDY5IDAsMS44ODM1NyAtMC42NjYyMiwzLjUzNzQ4IC0xLjk1MjYyLDQuODAxMTMgLTEuMzU1NDU5LDEuMzMyMTggLTMuMTAxMTgsMi4wNDQ0NCAtNC44OTI5MzgsMi4wNDQ0NCAtMS44MTQ3NzcsMCAtMy41MTQ3MjUsLTAuNzEyIC00LjgyMzg4MywtMi4wMjE0MiAtMS4zMDk0MjMsLTEuMzA5NjkgLTIuMDQ0NDM1LC0zLjAzMjM5IC0yLjA0NDQzNSwtNC44MjQxNSAwLC0xLjgxNDc3IDAuNzM1MDEyLC0zLjUzNzQ4IDIuMDQ0NDM1LC00Ljg2OTkyIDEuMjg2NDA0LC0xLjMwOTE2IDIuOTQwNTc5LC0xLjk5ODQgNC44MjQxNDgsLTEuOTk4NCB6IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8L2c+Cjwvc3ZnPgo=`, // this should be base64
  ...userPublicationMetadata,
}

module.exports = publicationMetadata
