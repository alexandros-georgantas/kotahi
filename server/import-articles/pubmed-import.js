/* eslint-disable camelcase, consistent-return */
const axios = require('axios')

const ArticleImportSources = require('../model-article-import-sources/src/articleImportSources')
const ArticleImportHistory = require('../model-article-import-history/src/articleImportHistory')
const Form = require('../model-form/src/form')

let isImportInProgress = false

const pubmedQueries = {
  clinicalPresentation: encodeURIComponent(
    '("clinical presentation" OR "clinical characteristics" OR "clinical features" OR "clinical findings" OR "clinical symptoms" OR "clinical symptom" OR "clinical manifestation" OR "clinical manifestations"  OR "clinical outcomes" OR "virulence"[mh] OR "virulence" OR "case fatality" OR "case fatalities" OR "disease progression"[mh] OR "disease progression" OR "disease course" OR "clinical deterioration" OR "disease exacerbation" OR "spontaneous remission") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  ),
  // FAILS WITH 414 CODE
  // pharmaceuticalInterventions: encodeURIComponent(
  //   '("Drug Therapy"[Mesh] OR "drug therapy"[tiab] OR "drug treatment"[tiab] OR "drug target"[tiab] OR "drug targets"[tiab] OR "drug trial" OR "drug trials" OR "pharmaceutical"[tiab] OR "drug repurposing" OR "antiviral"[tiab] OR "antivirals"[tiab] OR "agents"[tiab] OR "corticosteroid" OR "corticosteroids" OR "Angiotensin receptor blocker" OR "angiotensin receptor blockers" OR "statin" OR "statins" OR "hydroxychloroquine" OR "chloroquine" OR "oseltamivir" OR "arbidol" OR "remdesivir" OR "favipiravir" OR "angiotensin-converting enzyme inhibitors"[mh] OR "angiotensin-converting enzyme inhibitor" OR "angiotensin-converting enzyme inhibitors" OR "ACE inhibitor" OR "ACE inhibitors" OR "immunoglobulins"[mh] OR "immunoglobulin" OR "immunoglobulins" OR "IVIG" OR "arbidol"[nm] OR "arbidol" OR "umifenovir" OR "azithromycin"[mh] OR "azithromycin" OR "carrimycin" OR "danoprevir"[nm] OR "danoprevir" OR "interferons"[mh] OR "interferon" OR "interferons" OR "IFN" OR "darunavir"[mh] OR "darunavir" OR "prezista" OR "cobicistat"[mh] OR "cobicistat" OR "tybost" OR "Recombinant human interferon α2β" OR "recombinant human interferon alpha 2 beta" OR "thalidomide"[mh] OR "thalidomide" OR "sedoval" OR "thalomid" OR "methylprednisolone"[mh] OR "methylprednisolone" OR "metipred" OR "urbason" OR "Medrol" OR "pirfenidone"[nm] OR "pirfenidone" OR "Esbriet" OR "deskar" OR "bevacizumab"[mh] OR "bevacizumab" OR "mvasi" OR "avastin" OR "fingolimod hydrochloride"[mh] OR "fingolimod" OR "gilenya" OR "gilenia" OR "bromhexine"[mh] OR "bromhexine" OR "Clevudine"[nm] OR "clevudine" OR "Povidone-iodine"[mh] OR "povidone-iodine" OR "betadine" OR "minidyne" OR "Ruxolitinib" OR "INCB018424"[nm] OR "Acalabrutinib"[nm] OR "acalabrutinib" OR "calquence" OR "Vazegepant" OR "Eculizumab"[nm] OR "eculizumab" OR "soliris" OR "Lopinavir"[mh] OR "lopinavir" OR "Ritonavir"[mh] OR "ritonavir" OR "norvir" OR "Imatinib mesylate"[mh] OR "imatinib" OR "gleevec" OR "Baricitinib"[nm] OR "baricitinib" OR "olumiant" OR "dexamethasone"[mh] OR "dexamethasone" OR "decadron" OR "Leronlimab"[nm] OR "leronlimab" OR "Dalargin" OR "Mefloquin"[mh] OR "mefloquin" OR "mephloquine" OR "lariam" OR "Spironolactone"[mh] OR "spironolactone" OR "aldactone" OR "carospir" OR "Tocilizumab"[nm] OR "tocilizumab" OR "Clazakizumab"[nm] OR "clazakizumab" OR "Pyridostigmine bromide"[mh] OR "pyridostigmine" OR "mestinon" OR "indomethacin"[mh] OR "indomethacin" OR "indomethacine" OR "Indocin" OR "tivorbex" OR "Azithromycin"[mh] OR "azithromycin" OR "Zithromax" OR "Danoprevir"[nm] OR "danoprevir" OR "Tinzaparin"[mh] OR "tinzaparin" OR "innohep" OR "heparin"[mh] OR "Heparin" OR "Nitazoxanide"[nm] OR "nitazoxanide" OR "Ivermectin"[mh] OR "Ivermectin" OR "Niclosamide"[mh] OR "niclosamide" OR "Sarilumab"[nm] OR "sarilumab" OR "kevzara" OR "camostat"[nm] OR "Camostat" OR "tretinoin"[mh] OR "tretinoin" OR "Retinoic acid" OR "isotrentinoin" OR "vitamin a"[mh] OR "vitamin a" OR "methotrexate"[mh] OR "methotrexate" OR "Nafamostat"[nm] OR "nafamostat" OR "melatonin"[mh] OR "melatonin") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  // ),
  // diagnostics: encodeURIComponent(
  //   '("Specificity"[tiab] OR "sensitivity and specificity"[mh] OR "PCR"[tiab] OR "polymerase chain reaction" OR "rapid test" OR "false positive" OR "false negative" OR "positive predictive" OR "negative predictive" OR "predictive value" OR "immunoassay" OR "clinical diagnosis" OR "assay" OR "point of care testing" OR "diagnostic testing" OR "diagnostic performance" OR "diagnostic utility" OR "differential diagnosis" OR "molecular diagnosis") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  // ),
  // modeling: encodeURIComponent(
  //   '("models, theoretical"[mh] OR "theoretical model" OR "theoretical models" OR "mathematical model" OR "mathematical models" OR "mathematical modeling" OR "individual based model" OR "individual based models" OR "individual based modeling" OR "Patient-Specific Modeling"[mh] OR "patient-specific model" OR "patient-specific models" OR "patient-specific modeling" OR "agent based model" OR "agent based models" OR "agent based modeling" OR "forecasting"[mh] OR "forecast" OR "forecasting" OR "projection" OR "projections" OR "scenario" OR "scenarios" OR "health planning"[mh] OR "health planning" OR "nowcasting" OR "seir" OR "spatial" OR "demographic project" OR "demographic projections" OR "SIR" OR "R0" OR "RO"[tiab] OR "basic reproduction number" OR "transmission" OR "simulation" OR "simulations" OR "estimate" OR "estimates") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti] OR "dentistry"[tiab] OR "dental"[tiab])',
  // ),
  // epidemiology: encodeURIComponent(
  //   '("epidemiology"[mh] OR "epidemiologic studies"[mh] OR "epidemiologic measurements"[mh] OR "epidemiologic factors"[mh] OR "epidemiology" OR "epidemiologic" OR "epidemiological" OR "Disease transmission, infectious"[mh] OR "disease transmission" OR "transmission dynamics" OR "transmission network" OR "transmission cluster" OR "transmission factors" OR "horizontal transmission" OR "vertical transmission" OR "molecular epidemiology"[mh] OR "molecular epidemiology" OR "genetic epidemiology" OR "virus shedding"[mh] OR "virus shedding" OR "viral shedding" OR "infectious disease incubation period"[mh] OR "incubation period" OR "virus isolation" OR "serial interval" OR "basic reproduction number"[mh] OR "reproduction number" OR "reproductive number" OR "R0" OR "RO"[tiab] OR "case fatality" OR "fatality rate" OR "serosurvey" OR "seroepidemiologic studies"[mh] OR "seroepidemiologic" OR "seroprevalence" OR "attack rate" OR "genetics"[mh] OR "genetics"[subheading] OR "genetics" OR "prisons"[mh] OR "prison" OR "prisons" OR "assisted living facilities" OR "assisted living" OR "nursing home" OR "nursing homes" OR "long-term care facility" OR "long-term care facilities" OR "refugees"[mh] OR "refugee camps"[mh] OR "refugee" OR "refugees" OR "detention center" OR "detention centers" OR "detention camp" OR "detention camps" OR "natural history" OR "risk factors"[mh] OR "risk factor" OR "risk factors") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  // ),
  // ecologyAndSpillover: encodeURIComponent(
  //   '("zoonoses"[mh] OR "zoonoses" OR "zoonosis" OR "zoonotic" OR "cross-species" OR "disease reservoirs"[mh] OR "reservoir" OR "reservoirs" OR "origin" OR "ecology" OR "spillover") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  // ),
  // FAILS WITH 414 CODE
  // nonPharmaceuticalInterventions: encodeURIComponent(
  //   '("social isolation"[mh:noexp] OR "hand disinfection"[mh] OR "hand hygiene"[mh] OR "non-pharmaceutical intervention"[tw] OR "non-pharmaceutical interventions"[tw] OR "environmental NPI"[tw] OR "environmental NPIs"[tw] OR "personal NPI"[tw] OR "personal NPIs"[tw] OR "community NPI"[tw] OR "community NPIs"[tw] OR "school closure"[tw] OR "school closures"[tw] OR "workplace closure"[tw] OR "workplace closures"[tw] OR "work closure"[tw] OR "work closures"[tw] OR "office closure"[tw] OR "office closures"[tw] OR "church closure"[tw] OR "church closures"[tw] OR "synagogue closure"[tw] OR "synagogue closures"[tw] OR "mosque closure"[tw] OR "mosque closures"[tw] OR "mitigation"[tw] OR "patient isolation"[mh] OR "quarantine"[mh] OR "quarantine"[tw] OR "quarantining"[tw] OR "contact tracing"[mh] OR "contact tracing"[tw] OR "contact trace"[tw] OR "trace contacts"[tw] OR "social distancing"[tw] OR "physical distancing"[tw] OR "handwashing"[tw] OR "hand washing"[tw] OR "hand hygiene"[tw] OR "hand disinfection"[tw] OR "masks"[mh:noexp] OR "mask"[tw] OR "masked"[tw] OR "mask"[tw] OR "isolation"[tiab] OR "isolated"[tw] OR "event cancellation"[tw] OR "event cancellations"[tw] OR "event postponement"[tw] OR "event postponements"[tw] OR "travel restriction"[tw] OR "travel restrictions"[tw] OR "travel ban"[tw] OR "travel bans"[tw] OR "border closure"[tw] OR "border closures"[tw] OR "border restrictions"[tw] OR "border restriction"[tw] OR "traffic closure"[tw] OR "traffic closures"[tw] OR "traffic isolation"[tw] OR "traffic ban"[tw] OR "traffic control"[tw] OR "household confinement"[tw] OR "symptom screening"[tw] OR "symptom screenings"[tw] OR "nursing home closure"[tw] OR "nursing home closures"[tw] OR ("long term care"[tw] AND ("closure"[tw] OR "closures"[tw])) OR "venue closure"[tw] OR "venue closures"[tw] OR "restaurant closure"[tw] OR "restaurant closures"[tw] OR "limited gatherings"[tw] OR "limited gathering"[tw] OR (("testing"[tw] OR "screen"[tw] OR "screening"[tw]) AND ("symptomatic"[tw] OR "asymptomatic"[tw])) OR (("military"[tw] OR "national guard"[tw] OR "police"[tw]) AND ("deployment"[tw] OR "deployed"[tw])) OR "state of emergency"[tw] OR "surface cleaning"[tw] OR "surface disinfection"[tw]) AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  // ),
  // vaccines: encodeURIComponent(
  //   '("Immunotherapy, Active"[mh] OR "immunotherapy" OR "immunotherapies" OR "immunotherapeutics" OR "vaccines"[mh] OR "vaccine" OR "vaccines" OR "vaccination") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])',
  // ),
}

const getData = async ctx => {
  // if (isImportInProgress) {
  //   return
  // }

  isImportInProgress = true

  const dateTwoWeeksAgoFormatted = new Date(Date.now() - 12096e5)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '/')

  const dateTodayFormatted = new Date(Date.now())
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '/')

  const [checkIfSourceExists] = await ArticleImportSources.query().where({
    server: 'pubmed',
  })

  if (!checkIfSourceExists) {
    await ArticleImportSources.query().insert({
      server: 'pubmed',
    })
  }

  const [pubmedImportSourceId] = await ArticleImportSources.query().where({
    server: 'pubmed',
  })

  const lastImportDate = await ArticleImportHistory.query()
    .select('date')
    .where({
      sourceId: pubmedImportSourceId.id,
    })

  const minDate = lastImportDate.length
    ? new Date(lastImportDate[0].date)
        .toISOString()
        .split('T')[0]
        .toString()
        .replace(/-/g, '/')
    : dateTwoWeeksAgoFormatted

  console.log('minDate')
  console.log(minDate)
  console.log('dateTodayFormatted')
  console.log(dateTodayFormatted)

  const aa = Object.entries(pubmedQueries).map(
    async ([topic, query], index) => {
      const { data } = await axios.post(
        // 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmode=json&db=pubmed&term=("clinical presentation" OR "clinical characteristics" OR "clinical features" OR "clinical findings" OR "clinical symptoms" OR "clinical symptom" OR "clinical manifestation" OR "clinical manifestations"  OR "clinical outcomes" OR "virulence"[mh] OR "virulence" OR "case fatality" OR "case fatalities" OR "disease progression"[mh] OR "disease progression" OR "disease course" OR "clinical deterioration" OR "disease exacerbation" OR "spontaneous remission") AND ("COVID-19"[tw] OR "COVID 19"[tw] OR "COVID19"[tw] OR "COVID2019"[tw] OR "COVID 2019"[tw] OR "COVID-2019"[tw] OR "novel coronavirus"[tw] OR "new coronavirus"[tw] OR "novel corona virus"[tw] OR "new corona virus"[tw] OR "SARS-CoV-2"[tw] OR "SARSCoV2"[tw] OR "SARS-CoV2"[tw] OR "2019nCoV"[tw] OR "2019-nCoV"[tw] OR "2019 coronavirus"[tw] OR "2019 corona virus"[tw] OR "coronavirus disease 2019"[tw] OR "severe acute respiratory syndrome coronavirus 2"[nm] OR "severe acute respiratory syndrome coronavirus 2"[tw] OR "sars-coronavirus-2"[tw] OR "coronavirus disease 2019"[tw] OR "corona virus disease 2019"[tw]) NOT ("letter"[pt] OR "comment"[pt] OR "editorial"[pt] OR "review"[pt] OR "letter"[ti] OR "comment"[ti] OR "editorial"[ti] OR "brief communication"[ti] OR "review"[ti])&usehistory=y&mindate=2021/06/01&maxdate=2021/06/11',

        // `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmode=json&db=pubmed&term=${query}&usehistory=y&mindate=${minDate}&maxdate=${dateTodayFormatted}`,
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmax=100000&retmode=json&db=pubmed&term=${query}&usehistory=y&mindate=${minDate}&maxdate=${dateTodayFormatted}`,
      )

      return { topic, ids: data.esearchresult.idlist }
      // console.log(data)
    },
  )

  const bb = await Promise.all(aa)
  const idList = bb[0].ids.join(',')

  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${idList}&tool=my_tool&email=my_email@example.com&retmode=xml`
  const idsResponse = await axios.get(url)
  console.log(idsResponse.data)

  return

  const importedManuscripts = await aa(0, date, [])

  const manuscripts = await ctx.models.Manuscript.query()

  const currentDOIs = manuscripts.map(({ submission }) => {
    return submission.articleURL
  })

  const withoutDuplicates = importedManuscripts.filter(
    ({ rel_doi, version, rel_site }) =>
      !currentDOIs.includes(
        `https://${rel_site.toLowerCase()}/content/${rel_doi}v${version}`,
      ),
  )

  const submissionForm = await Form.findOneByField('purpose', 'submit')

  const parsedFormStructure = submissionForm.structure.children
    .map(formElement => {
      const parsedName = formElement.name && formElement.name.split('.')[1]

      if (parsedName) {
        return {
          name: parsedName,
          component: formElement.component,
        }
      }

      return undefined
    })
    .filter(x => x !== undefined)

  const emptySubmission = parsedFormStructure.reduce((acc, curr) => {
    acc[curr.name] =
      curr.component === 'CheckboxGroup' || curr.component === 'LinksInput'
        ? []
        : ''
    return {
      ...acc,
    }
  }, {})

  const newManuscripts = withoutDuplicates.map(
    ({ rel_doi, rel_site, version, rel_title, rel_abs }) => {
      const manuscriptTopics = Object.entries(topics)
        .filter(([topicName, topicKeywords]) => {
          return (
            !!topicKeywords[0].filter(keyword => rel_abs.includes(keyword))
              .length &&
            !!topicKeywords[1].filter(keyword => rel_abs.includes(keyword))
              .length
          )
        })
        .map(([topicName]) => topicName)

      return {
        status: 'new',
        isImported: true,
        importSource: biorxivImportSourceId.id,
        importSourceServer: rel_site.toLowerCase(),
        submission: {
          ...emptySubmission,
          articleURL: `https://${rel_site.toLowerCase()}/content/${rel_doi}v${version}`,
          articleDescription: rel_title,
          abstract: rel_abs,
          topics: manuscriptTopics.length ? [manuscriptTopics[0]] : [],
        },
        meta: {
          title: '',
          notes: [
            {
              notesType: 'fundingAcknowledgement',
              content: '',
            },
            {
              notesType: 'specialInstructions',
              content: '',
            },
          ],
        },
        submitterId: null,
        channels: [
          {
            topic: 'Manuscript discussion',
            type: 'all',
          },
          {
            topic: 'Editorial discussion',
            type: 'editorial',
          },
        ],
        files: [],
        reviews: [],
        teams: [],
      }
    },
  )

  if (!newManuscripts.length) {
    isImportInProgress = false

    return []
  }

  try {
    const inserted = await ctx.models.Manuscript.query().insert(newManuscripts)

    if (lastImportDate.length) {
      await ArticleImportHistory.query()
        .update({
          date: new Date().toISOString(),
        })
        .where({
          date: lastImportDate[0].date,
        })
    } else {
      await ArticleImportHistory.query().insert({
        date: new Date().toISOString(),
        sourceId: biorxivImportSourceId.id,
      })
    }

    isImportInProgress = false

    return inserted
  } catch (e) {
    /* eslint-disable-next-line */
    console.error(e.message)
    isImportInProgress = false
  }
}

module.exports = getData
