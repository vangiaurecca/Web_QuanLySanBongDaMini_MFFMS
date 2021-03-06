import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { formatDateString, apiGet, deepGet } from '../utils'
import apiRoutes from '../routes/apis'

class ForListPrintPage extends Component {
   constructor(props) {
      super(props)

      this.state = {
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

   componentDidMount() {
      const { fetchData } = this

      fetchData()
   }

   ///// METHODS FOR INTERACTING WITH API /////

   fetchData = () => {
      const { fetchSettingsData } = this

      fetchSettingsData()
   }

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

   ///// METHODS FOR COMPUTING VALUES /////

   getCellValue = (column, value) => {
      const { type, propForValue } = column

      if (value !== '' && value !== undefined) {
         switch (type) {
            case 'string': {
               return deepGet(value, propForValue)
            }

            case 'date': {
               return formatDateString(deepGet(value, propForValue))
            }

            default: {
               return deepGet(value, propForValue)
            }
         }
      } else {
         return '(Chưa có dữ liệu)'
      }
   }

   ///// METHODS FOR RENDERING UI /////

   renderHeader = () => {
      const { renderTopHeader, renderMainHeader } = this

      return (
         <div className="printing-page__header">
            {renderTopHeader()}
            {renderMainHeader()}
         </div>
      )
   }

   renderTopHeader = () => {
      const { renderTopHeaderLeft, renderTopHeaderRight } = this

      return (
         <div className="printing-page__header-top">
            {renderTopHeaderLeft()}
            {renderTopHeaderRight()}
         </div>
      )
   }

   renderTopHeaderLeft = () => {
      const { settingsData } = this.state
      const { tenSanBong, diaChi, soDienThoai, fax } = settingsData

      return (
         <div className="print-page__header-top-left">
            <p className="printing-page__company">{tenSanBong}</p>
            <p className="printing-page__address">Địa chỉ: {diaChi}</p>
            <p className="printing-page__phones">
               Điện thoại: {soDienThoai}{' '}
               {fax !== '' && <Fragment>- Fax: {fax}</Fragment>}
            </p>
         </div>
      )
   }

   renderTopHeaderRight = () => {}

   renderMainHeader = () => {
      const { settings } = this.props
      const { entity } = settings
      const { name } = entity

      return (
         <div className="printing-page__main">
            <h1 className="printing-page-title">
               DANH SÁCH {name.toUpperCase()} TRONG HỆ THỐNG
            </h1>
         </div>
      )
   }

   renderBody = () => {
      const { renderTable } = this

      return <div className="printing-page__body">{renderTable()}</div>
   }

   renderTable = () => {
      const { renderTableHeader, renderTableBody } = this

      return (
         <table className="printing-page-table">
            {renderTableHeader()}
            {renderTableBody()}
         </table>
      )
   }

   renderTableHeader = () => {
      const { settings } = this.props
      const { columns } = settings

      return (
         <thead>
            <tr>
               <th>STT</th>
               {columns.map((column, index) => (
                  <th key={index}>{column.text}</th>
               ))}
            </tr>
         </thead>
      )
   }

   renderTableBody = () => {
      const { getCellValue } = this
      const { settings } = this.props
      const { data, columns } = settings

      return (
         <tbody>
            {data.length > 0 &&
               data.map((record, index) => (
                  <tr key={index}>
                     <td>{index + 1}</td>
                     {columns.map((column, index) => (
                        <td key={index}>{getCellValue(column, record)}</td>
                     ))}
                  </tr>
               ))}
         </tbody>
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

   renderFooter = () => {
      const { renderTopFooter, renderMainFooter } = this

      return (
         <div className="printing-page__footer">
            {renderTopFooter()}
            {renderMainFooter()}
         </div>
      )
   }

   renderTopFooter = () => {
      const { renderTopFooterLeft, renderTopFooterRight } = this

      return (
         <div className="printing-page__footer-top">
            {renderTopFooterLeft()}
            {renderTopFooterRight()}
         </div>
      )
   }

   renderTopFooterLeft = () => {
      return <div className="printing-page__footer-top-left"></div>
   }

   renderTopFooterRight = () => {
      const { settingsData } = this.state
      const { diaChiTrenPhieu } = settingsData

      return (
         <div className="printing-page__footer-top-right">
            <p>
               {diaChiTrenPhieu}, ngày {moment().format('DD')} tháng{' '}
               {moment().format('MM')} năm {moment().format('YYYY')}
            </p>
         </div>
      )
   }

   renderMainFooter = () => {
      return (
         <div className="printing-page__footer-main">
            <div className="printing-page__footer-main-left">
               <p className="printing-page__job-title">NGƯỜI DUYỆT</p>
               <p className="printing-page__signature">(Ký và ghi rõ họ tên)</p>
            </div>

            <div className="printing-page__footer-main-right">
               <p className="printing-page__job-title">NGƯỜI LẬP</p>
               <p className="printing-page__signature">(Ký và ghi rõ họ tên)</p>
            </div>
         </div>
      )
   }

   renderInternalCss = () => {
      const style = `<style>@media print { @page { size: landscape; } }</style>`

      return <div dangerouslySetInnerHTML={{ __html: style }}></div>
   }

   renderComponent = () => {
      const { renderHeader, renderBody, renderFooter, renderInternalCss } = this

      return (
         <div className="printing-page">
            {renderHeader()}
            {renderBody()}
            {renderFooter()}
            {renderInternalCss()}
         </div>
      )
   }

   render() {
      const { renderComponent } = this

      return renderComponent()
   }
}

export default ForListPrintPage
