import React, { Component, Fragment } from 'react'
import Section from './Section'
import { Link, withRouter } from 'react-router-dom'
import {
   apiGet,
   formatDateString,
   scrollTop,
   print,
   numberWithCommas,
   deepGet
} from '../utils'
import LoadingIndicator from './LoadingIndicator'
import ForDetailsPrintPage from './ForDetailsPrintPage'
import Select from 'react-select'
import moment from 'moment'
import exportFromJSON from 'export-from-json'
import ExportReportDialog from './ExportReportDialog'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { excelFormat } from '../utils'
import { connect } from 'react-redux'
import { showNotification } from '../redux/actions'
import apiRoutes from '../routes/apis'

const customStyles = {
   control: () => ({
      border: '2px solid #edf0f5',
      display: 'flex',
      fontWeight: 'normal',
      paddingTop: '3px',
      paddingBottom: '2px',
      backgroundColor: '#edf0f5'
   })
}

class ForViewPage extends Component {
   constructor(props) {
      super(props)

      this.state = {
         data: null,
         loading: true,
         showExportReportDialog: false,
         settingsData: {
            tenSanBong: '',
            diaChi: '',
            diaChiTrenPhieu: '',
            soDienThoai: '',
            fax: ''
         }
      }
   }

   ///// METHODS FOR REACT LIFECYCLES /////

   componentWillMount() {
      const { fetchData } = this

      fetchData()
   }

   componentDidMount() {
      const { fetchSettingsData } = this

      scrollTop()
      fetchSettingsData()
   }

   ///// METHODS FOR INTERACTING WITH API /////

   fetchSettingsData = async () => {
      const { caiDat } = apiRoutes
      const url = caiDat.getAll

      try {
         const response = await apiGet(url)

         if (response && response.data.status === 'SUCCESS') {
            const { data } = response.data.result

            this.setState({
               settingsData: data
            })
         } else {
            throw new Error(response.errors)
         }
      } catch (error) {
         console.error(error)
      }
   }

   fetchData = async () => {
      const { settings, match } = this.props
      const { api } = settings
      const { id } = match.params
      const url = `${api.getById}/${id}`

      try {
         const response = await apiGet(url)

         if (response && response.data.status === 'SUCCESS') {
            const { data } = response.data.result

            this.setState({ data, loading: false })
         } else {
            throw new Error(response.errors)
         }
      } catch (error) {
         console.error(error)
      }
   }

   ///// METHODS FOR HANDLING UI EVENTS /////

   refresh = () => {
      const { fetchData } = this

      this.setState({ loading: true }, fetchData)
   }

   exportData = async () => {
      const { data } = this.state
      const { settings } = this.props
      const { entity } = settings
      const { slug } = entity
      const fileName = `${slug}-${moment().format('DDMMYYYY')}`
      const exportType = 'json'

      await exportFromJSON({ data: [data], fileName, exportType })
   }

   exportToPdf = () => {
      const { showSuccessNotification } = this

      print()
      showSuccessNotification()
   }

   exportToXlsx = () => {
      const { showSuccessNotification } = this
      const { data, settingsData } = this.state
      const {
         tenSanBong,
         diaChi,
         diaChiTrenPhieu,
         soDienThoai,
         fax
      } = settingsData
      const { settings } = this.props
      const { entity, fields } = settings
      const { name, slug } = entity
      const fileName = `thong-tin-${slug}-${moment().format('DDMMYYYY')}`
      let workbook = new Excel.Workbook()
      let worksheet = workbook.addWorksheet(moment().format('DD-MM-YYYY'), {
         pageSetup: { fitToPage: true, orientation: 'portrait' }
      })
      let currentRowCount = 7

      workbook.Props = {
         Title: fileName,
         Subject: `Th??ng tin chi ti???t v??? ${name}`,
         Author: 'MFFMS',
         CreatedDate: moment()
      }

      worksheet.mergeCells('A1:G1')
      worksheet.getCell('A1').value = tenSanBong
      worksheet.getCell('A1').font = excelFormat.boldFont

      worksheet.mergeCells('A2:G2')
      worksheet.getCell('A2').value = diaChi
      worksheet.getCell('A2').font = excelFormat.boldFont

      worksheet.mergeCells('A3:G3')
      worksheet.getCell(
         'A3'
      ).value = `S??? ??i???n tho???i: ${soDienThoai} - Fax: ${fax}`
      worksheet.getCell('A3').font = excelFormat.boldFont

      worksheet.mergeCells('A5:M5')
      worksheet.getCell(
         'M5'
      ).value = `TH??NG TIN CHI TI???T V??? ${name.toUpperCase()}`
      worksheet.getCell('M5').font = { ...excelFormat.boldFont, size: 18 }
      worksheet.getCell('M5').alignment = excelFormat.center

      fields.forEach((field, index) => {
         const { label, propForValue, type } = field

         worksheet.mergeCells(`B${currentRowCount}:D${currentRowCount}`)
         worksheet.mergeCells(`E${currentRowCount}:L${currentRowCount}`)

         worksheet.getCell(`B${currentRowCount}`).value = label
         worksheet.getCell(`B${currentRowCount}`).font = excelFormat.boldFont
         worksheet.getCell(`B${currentRowCount}`).alignment = excelFormat.left

         worksheet.getCell(`E${currentRowCount}`).value = (type => {
            switch (type) {
               case 'date': {
                  return formatDateString(deepGet(data, propForValue))
               }

               default: {
                  return deepGet(data, propForValue)
               }
            }
         })(type)
         worksheet.getCell(`E${currentRowCount}`).font = excelFormat.normalFont
         worksheet.getCell(`E${currentRowCount}`).alignment = excelFormat.left

         currentRowCount += index !== fields.length - 1 ? 2 : 0
      })

      worksheet.mergeCells(
         'G' + (currentRowCount + 2) + ':M' + (currentRowCount + 2)
      )
      worksheet.getCell(
         'G' + (currentRowCount + 2)
      ).value = `${diaChiTrenPhieu}, ng??y ${moment().format(
         'DD'
      )} th??ng ${moment().format('MM')} n??m ${moment().format('YYYY')}`
      worksheet.getCell('G' + (currentRowCount + 2)).font =
         excelFormat.italicFont
      worksheet.getCell('G' + (currentRowCount + 2)).alignment =
         excelFormat.right

      worksheet.mergeCells(
         'B' + (currentRowCount + 4) + ':D' + (currentRowCount + 4)
      )
      worksheet.getCell('B' + (currentRowCount + 4)).value = `NG?????I DUY???T`
      worksheet.getCell('B' + (currentRowCount + 4)).font = excelFormat.boldFont
      worksheet.getCell('B' + (currentRowCount + 4)).alignment =
         excelFormat.center

      worksheet.mergeCells(
         'J' + (currentRowCount + 4) + ':L' + (currentRowCount + 4)
      )
      worksheet.getCell('J' + (currentRowCount + 4)).value = `NG?????I L???P`
      worksheet.getCell('J' + (currentRowCount + 4)).font = excelFormat.boldFont
      worksheet.getCell('J' + (currentRowCount + 4)).alignment =
         excelFormat.center

      worksheet.mergeCells(
         'A' + (currentRowCount + 5) + ':E' + (currentRowCount + 5)
      )
      worksheet.getCell(
         'A' + (currentRowCount + 5)
      ).value = `(K?? v?? ghi r?? h??? t??n)`
      worksheet.getCell('A' + (currentRowCount + 5)).font =
         excelFormat.italicFont
      worksheet.getCell('A' + (currentRowCount + 5)).alignment =
         excelFormat.center

      worksheet.mergeCells(
         'I' + (currentRowCount + 5) + ':M' + (currentRowCount + 5)
      )
      worksheet.getCell(
         'I' + (currentRowCount + 5)
      ).value = `(K?? v?? ghi r?? h??? t??n)`
      worksheet.getCell('I' + (currentRowCount + 5)).font =
         excelFormat.italicFont
      worksheet.getCell('I' + (currentRowCount + 5)).alignment =
         excelFormat.center

      workbook.xlsx.writeBuffer().then(function(data) {
         var blob = new Blob([data], {
            type:
               'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
         })
         saveAs(blob, fileName)
      })

      showSuccessNotification()
   }

   toggleExportReportDialog = () => {
      const { showExportReportDialog } = this.state

      this.setState({ showExportReportDialog: !showExportReportDialog })
   }

   ///// METHODS FOR COMPUTING VALUES /////

   getFieldValue = (valueType, value) => {
      if (value !== '' && value !== undefined) {
         switch (valueType) {
            case 'date': {
               return formatDateString(value)
            }

            case 'number': {
               return numberWithCommas(value)
            }

            case 'string': {
               return value
            }

            default: {
               return value
            }
         }
      } else {
         return '(Ch??a c?? d??? li???u)'
      }
   }

   ///// METHODS FOR RENDERING UI /////

   showSuccessNotification = () => {
      const { showNotification } = this.props

      showNotification('success', 'Xu???t b??o c??o th??nh c??ng!')
   }

   showErrorNotification = () => {
      const { showNotification } = this.props

      showNotification('error', 'Xu???t b??o c??o th???t b???i!')
   }

   renderHeader = () => {
      const { settings } = this.props
      const { entity } = settings
      const { name, slug } = entity

      return (
         <span className="breadcrumbs">
            <span className="breadcrumb-home">
               <Link to="/">Mini Football Field Management System (MFFMS)</Link>
            </span>
            <span className="breadcrumb-separator">
               <i className="fas fa-chevron-right"></i>
            </span>
            <span className="breadcrumb">
               <Link to={`/quan-ly/${slug}`}>Qu???n l?? {name}</Link>
            </span>
            <span className="breadcrumb-separator">
               <i className="fas fa-chevron-right"></i>
            </span>
            <span className="breadcrumb-active">
               <Link to="#">Xem th??ng tin {name}</Link>
            </span>
         </span>
      )
   }

   renderSectionHeaderRight = () => {
      const { refresh, exportData, toggleExportReportDialog } = this
      const { data } = this.state
      const { settings } = this.props
      const { exportable = true } = settings

      return (
         <Fragment>
            <span className="button" onClick={refresh}>
               <i className="fas fa-redo"></i>&nbsp;&nbsp;T???i l???i
            </span>

            {/* {data !== null && (
               <span className="button" onClick={exportData}>
                  <i className="fas fa-file-export"></i>&nbsp;&nbsp;Xu???t d??? li???u
               </span>
            )} */}

            {exportable && data !== null && (
               <span className="button" onClick={toggleExportReportDialog}>
                  <i className="fas fa-file-export"></i>&nbsp;&nbsp;Xu???t b??o c??o
               </span>
            )}
         </Fragment>
      )
   }

   renderBody = () => {
      const { renderSectionHeaderRight, renderForm, renderFormFooter } = this
      const { settings } = this.props
      const { entity } = settings
      const { name } = entity
      const section = {
         title: `Xem th??ng tin ${name}`,
         subtitle: `Xem th??ng tin chi ti???t c???a ${name}`,
         headerRight: renderSectionHeaderRight(),
         footerRight: renderFormFooter()
      }

      return <Section section={section}>{renderForm()}</Section>
   }

   renderForm = () => {
      const { renderFormGroup } = this
      const { settings } = this.props
      const { fields } = settings

      return (
         <Fragment>
            <form autoComplete="off">
               {fields.map((field, index) => renderFormGroup(field, index))}
            </form>
         </Fragment>
      )
   }

   renderFormGroup = (field, index) => {
      const { renderField } = this
      const { label } = field

      return (
         <div className="form-group" key={index}>
            <label className="form-label">{label}</label>
            {renderField(field)}
         </div>
      )
   }

   renderField = field => {
      const { getFieldValue } = this
      const { data } = this.state
      const { type, propForValue } = field

      switch (type) {
         case 'input': {
            return (
               <input
                  className="form-input-disabled"
                  type="text"
                  value={getFieldValue('text', data && data[propForValue])}
                  disabled={true}
               />
            )
         }

         case 'password': {
            return (
               <input
                  className="form-input-disabled"
                  type="password"
                  value={getFieldValue('text', data && data[propForValue])}
                  disabled={true}
               />
            )
         }

         case 'email': {
            return (
               <input
                  className="form-input-disabled"
                  type="email"
                  value={getFieldValue('text', data && data[propForValue])}
                  disabled={true}
               />
            )
         }

         case 'date': {
            return (
               <input
                  className="form-input-disabled"
                  type="text"
                  value={getFieldValue('date', data && data[propForValue])}
                  disabled={true}
               />
            )
         }

         case 'select': {
            const { values, propForItemText, propForItemValue } = field

            return (
               <Select
                  value={values.find(
                     item => item.value === deepGet(data, propForValue)
                  )}
                  options={values}
                  styles={customStyles}
                  isDisabled={true}
               />
            )
         }

         case 'textarea': {
            return (
               <textarea
                  className="form-input-disabled"
                  value={getFieldValue('text', data && data[propForValue])}
                  disabled={true}
               ></textarea>
            )
         }
      }
   }

   renderFormFooter = () => {
      const { settings } = this.props
      const { entity } = settings
      const { slug } = entity

      return (
         <Fragment>
            <span className="button">
               <Link to={`/quan-ly/${slug}`}>
                  <i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Tr??? v???
               </Link>
            </span>
         </Fragment>
      )
   }

   renderDialogs = () => {
      const { toggleExportReportDialog, exportToPdf, exportToXlsx } = this
      const { showExportReportDialog, data } = this.state
      const { settings } = this.props
      const { entity } = settings
      const dialogSettings = {
         isOpen: showExportReportDialog,
         onClose: toggleExportReportDialog,
         onExportToPdf: exportToPdf,
         onExportToXlsx: exportToXlsx,
         entity,
         data
      }

      return (
         <Fragment>
            <ExportReportDialog settings={dialogSettings} />
         </Fragment>
      )
   }

   renderComponent = () => {
      const { renderHeader, renderBody, renderDialogs } = this
      const { data, loading } = this.state
      const { settings } = this.props
      const { entity, fields } = settings
      const printSettings = {
         entity,
         fields,
         data
      }

      return (
         <LoadingIndicator isLoading={loading}>
            {renderHeader()}
            {renderBody()}
            {renderDialogs()}

            {/* <ForDetailsPrintPage set/tings={printSettings} /> */}
         </LoadingIndicator>
      )
   }

   render() {
      const { renderComponent } = this

      return renderComponent()
   }
}

export default withRouter(connect(null, { showNotification })(ForViewPage))
