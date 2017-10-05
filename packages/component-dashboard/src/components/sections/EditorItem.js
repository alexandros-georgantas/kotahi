import React from 'react'
import Status from '../Status'
import MetadataSections from '../metadata/MetadataSections'
import MetadataType from '../metadata/MetadataType'
import MetadataReviewType from '../metadata/MetadataReviewType'
import MetadataSubmittedDate from '../metadata/MetadataSubmittedDate'
import MetadataOwners from '../metadata/MetadataOwners'
import ProjectLink from '../ProjectLink'
import Divider from './Divider'
import classes from './Item.local.scss'
import Reviews from '../Reviews'

const EditorItem = ({ AssignEditor, project, version, addUserToTeam }) => (
  <div className={classes.root}>
    <div className={classes.header}>
      <Status status={project.status}/>

      <div className={classes.meta}>
        <MetadataOwners owners={project.owners}/>
        <Divider separator="–"/>
        <MetadataSubmittedDate submitted={version.submitted}/>
        <Divider separator="–"/>
        <MetadataType type={version.metadata.articleType}/>
        <Divider separator="–"/>
        <MetadataSections sections={version.metadata.articleSection}/>
        <Divider separator="–"/>
        <MetadataReviewType openReview={version.declarations.openReview}/>
      </div>
    </div>

    <div className={classes.main}>
      <div className={classes.title}>
        <span>{project.title || 'Untitled'}</span>
      </div>

      <div className={classes.links}>
        <div className={classes.link}>
          {(!version.decision || version.decision.status !== 'submitted') && (
            <span>
              <ProjectLink
                project={project}
                version={version}
                page="reviewers">Assign Reviewers</ProjectLink>

              <Divider separator="|"/>
            </span>
          )}

          <ProjectLink
            project={project}
            version={version}
            page="decisions"
            id={project.id}>
              {version.decision && version.decision.status === 'submitted'
                ? `Decision: ${version.decision.recommendation}`
                : 'Make decision'}
          </ProjectLink>
        </div>
      </div>

      <div className={classes.actions}/>
    </div>



    <div className={classes.roles}>
      <div className={classes.role}>
        <AssignEditor
          project={project}
          teamTypeName="seniorEditor"
          addUserToTeam={addUserToTeam}/>
      </div>

      <div className={classes.role}>
        <AssignEditor
          project={project}
          teamTypeName="handlingEditor"
          addUserToTeam={addUserToTeam}/>
      </div>


    </div>

    <div className={classes.reviews}>
      <Reviews
        project={project}
        version={version}/>
    </div>
  </div>
)

export default EditorItem
