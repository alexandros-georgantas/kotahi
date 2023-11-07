import React from 'react'
import { Attachment } from '../../../shared'
import ThreadedDiscussion from '../../../component-formbuilder/src/components/builderComponents/ThreadedDiscussion/ThreadedDiscussion'

const getManuscriptFileComponent = submittedManuscriptFile => {
  return {
    component: submittedManuscriptFile
      ? () => (
          <Attachment
            file={submittedManuscriptFile}
            key={submittedManuscriptFile.storedObjects[0].url}
            uploaded
          />
        )
      : null,
  }
}

const getThreadedDiscussionComponent = (
  tdProps,
  shouldShowPublishingControls,
  fieldsToPublish,
  latestVersionId,
  thisVersionId,
) => {
  return {
    customValidate: (value, validators) => {
      if (!validators.some(v => v.value === 'required')) return null

      const threadedDiscussion = tdProps?.threadedDiscussions.find(
        d => d.id === value,
      )

      let isThreadedDiscussionValid = false

      if (threadedDiscussion) {
        const firstComment = threadedDiscussion.threads?.[0].comments?.[0]

        const commentVersionsLength = firstComment?.commentVersions.length

        if (
          firstComment?.pendingVersion &&
          firstComment?.pendingVersion.comment !== '<p class="paragraph"></p>'
        ) {
          isThreadedDiscussionValid = true
        } else if (
          commentVersionsLength &&
          firstComment?.commentVersions[commentVersionsLength - 1]
        ) {
          isThreadedDiscussionValid = true
        }
      }

      if (isThreadedDiscussionValid) {
        return null
      }

      return 'Required'
    },
    component: ({
      value,
      setShouldPublishField,
      permitPublishing,
      name,
      readonly,
      hasSubmitButton,
      ...rest
    }) => {
      const setShouldPublishComment =
        shouldShowPublishingControls &&
        permitPublishing === 'true' &&
        ((id, val) => setShouldPublishField(`${name}:${id}`, val))

      const threadedDiscussion = tdProps?.threadedDiscussions.find(
        d => d.id === value,
      )

      const threadedDiscussionProps = {
        ...(tdProps || {}),
        threadedDiscussion,
        threadedDiscussions: undefined, // hide this value
        commentsToPublish: fieldsToPublish
          .filter(f => f.startsWith(`${name}:`))
          .map(f => f.split(':')[1]),
        setShouldPublishComment,
        shouldRenderSubmitButton: !hasSubmitButton,
        userCanAddThread: true,
        manuscriptLatestVersionId: latestVersionId,
        selectedManuscriptVersionId: thisVersionId,
      }

      return <ThreadedDiscussion {...rest} {...threadedDiscussionProps} />
    },
    onSubmit: async threadedDiscussionId => {
      if (threadedDiscussionId)
        tdProps.completeComments({ variables: { threadedDiscussionId } })
    },
  }
}

const getComponentsForManuscriptVersions = (
  versions,
  threadedDiscussionProps,
  shouldShowPublishingControls,
) => {
  const latestVersionId = versions[0].manuscript.id

  const result = {}
  versions.forEach(version => {
    const manuscriptFile = version.manuscript.files?.find(file =>
      file.tags.includes('manuscript'),
    )

    const fieldsToPublish =
      version.manuscript.formFieldsToPublish?.find(
        ff => ff.objectId === version.id,
      )?.fieldsToPublish ?? []

    result[version.manuscript.id] = {
      ManuscriptFile: getManuscriptFileComponent(manuscriptFile),
      ThreadedDiscussion: getThreadedDiscussionComponent(
        threadedDiscussionProps,
        shouldShowPublishingControls &&
          version.manuscript.id === latestVersionId,
        fieldsToPublish,
        latestVersionId,
        version.manuscript.id,
      ),
    }
  })

  return result
}

export default getComponentsForManuscriptVersions
