import { emDash, ellipsis } from 'prosemirror-inputrules'
import {
  InlineAnnotationsService,
  ImageService,
  LinkService,
  ListsService,
  BaseService,
  DisplayBlockLevelService,
  TextBlockLevelService,
  NoteService,
  TrackChangeService,
  // TrackOptionsService,
  CommentsService,
  MathService,
  FindAndReplaceService,
  FullScreenService,
  SpecialCharactersService,
  BottomInfoService,
  EditingSuggestingService,
} from 'wax-prosemirror-services'
import {
  TablesService,
  /* tableEditing, */ columnResizing,
} from 'wax-table-service'
// import TrackChangeService from '../CustomWaxToolGroups/TrackChangeService/TrackChangeService'
import {
  KotahiBlockDropDownToolGroupService,
  JatsSideMenuToolGroupService,
  JatsAnnotationListTooolGroupService,
} from '../CustomWaxToolGroups'
import JatsTagsService from '../JatsTags'
import CharactersList from './CharactersList'
import KotahiSchema from './KotahiSchema'
import CitationService from '../CustomWaxToolGroups/CitationService/CitationService'
import 'wax-table-service/dist/index.css'

const updateTitle = title => {
  // this gets fired when the title is changed in original version of this—not called now, but might still be needed
  // console.log(`Title changed: ${title}`)
}

const productionWaxEditorConfig = (
  readOnlyComments,
  handleAssetManager,
  updateAnystyle,
  updateCrossRef,
  styleReference,
) => ({
  EnableTrackChangeService: {
    enabled: false,
    toggle: true,
    updateTrackStatus: () => true,
  },
  AcceptTrackChangeService: {
    own: {
      accept: true,
    },
    others: {
      accept: true,
    },
  },
  RejectTrackChangeService: {
    own: {
      reject: true,
    },
    others: {
      reject: true,
    },
  },
  SchemaService: KotahiSchema,
  CommentsService: { readOnly: readOnlyComments || false }, // this should make it work though this is not yet in Wax
  MenuService: [
    {
      templateArea: 'topBar',
      toolGroups: [
        {
          name: 'Base',
          exclude: ['Save'],
        },
        'KotahiBlockDropDown',
        {
          name: 'Annotations',
          more: [
            'Superscript',
            'Subscript',
            'SmallCaps',
            'Underline',
            'StrikeThrough',
            'Code',
          ],
        },
        'SpecialCharacters',
        'Lists',
        'Notes',
        'Tables',
        'Images',
        'TrackingAndEditing',
        'FullScreen',
      ],
    },
    {
      templateArea: 'leftSideBar',
      toolGroups: ['JatsSideMenu'],
    },
    {
      templateArea: 'commentTrackToolBar',
      toolGroups: ['TrackCommentOptions'],
    },
    {
      templateArea: 'bottomRightInfo',
      toolGroups: [{ name: 'InfoToolGroup', exclude: ['ShortCutsInfo'] }],
    },
  ],

  PmPlugins: [columnResizing() /* tableEditing() */],

  RulesService: [emDash, ellipsis],

  ShortCutsService: {},
  SpecialCharactersService: CharactersList,

  TitleService: { updateTitle },
  ImageService: handleAssetManager ? { handleAssetManager } : {},
  CitationService: {
    AnyStyleTransformation: updateAnystyle,
    CrossRefTransformation: updateCrossRef,
    CiteProcTransformation: styleReference,
    readOnly: false,
  },
  services: [
    new BaseService(),
    new ImageService(),
    new InlineAnnotationsService(),
    new ListsService(),
    new TextBlockLevelService(),
    new DisplayBlockLevelService(),
    new NoteService(),
    new CommentsService(),
    new LinkService(),
    new TrackChangeService(),
    new MathService(),
    new FindAndReplaceService(),
    new FullScreenService(),
    new SpecialCharactersService(),
    new BottomInfoService(),
    new EditingSuggestingService(),
    // new TrackOptionsService(),
    new TablesService(),
    new JatsTagsService(),
    new JatsSideMenuToolGroupService(),
    new JatsAnnotationListTooolGroupService(),
    new CitationService(),
    new KotahiBlockDropDownToolGroupService(),
  ],
})

export default productionWaxEditorConfig
