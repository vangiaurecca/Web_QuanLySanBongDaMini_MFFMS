import React, { Component } from 'react'
import ForViewPage from '../../components/ForViewWithListPage'
import { phieuDatSan, chiTietPhieuDatSan } from '../../entities'
import apiRoutes from '../../routes/apis'
import { apiGet } from '../../utils'

class PhieuDatSanForView extends Component {
   constructor(props) {
      super(props)

      this.state = {
         employees: [],
         services: [],
         customers: [],
         pitches: []
      }
   }

   ////// METHODS FOR REACT LIFECYCLES /////

   componentDidMount() {
      const { fetchData } = this

      fetchData()
   }

   ///// METHODS FOR INTERACTING WITH API /////

   fetchData = () => {
      const {
         fetchServices,
         fetchEmployees,
         fetchCustomers,
         fetchPitches
      } = this

      fetchServices()
      fetchEmployees()
      fetchCustomers()
      fetchPitches()
   }

   fetchServices = async () => {
      const url = apiRoutes.dichVu.getAll
      const queries = { pageSize: 1000 }

      try {
         const response = await apiGet(url, queries)

         if (response && response.data.status === 'SUCCESS') {
            const { data } = response.data.result

            this.setState({ services: data })
         } else {
            throw new Error(response.errors)
         }
      } catch (error) {
         console.error(error)
      }
   }

   fetchEmployees = async () => {
      const url = apiRoutes.nhanVien.getAll
      const queries = { pageSize: 1000 }

      try {
         const response = await apiGet(url, queries)

         if (response && response.data.status === 'SUCCESS') {
            const { data } = response.data.result

            this.setState({ employees: data })
         } else {
            throw new Error(response.errors)
         }
      } catch (error) {
         console.error(error)
      }
   }

   fetchCustomers = async () => {
      const url = apiRoutes.khachHang.getAll
      const queries = {
         pageSize: 1000
      }

      try {
         const response = await apiGet(url, queries)

         if (response && response.data.status === 'SUCCESS') {
            const { data } = response.data.result

            this.setState({ customers: data })
         } else {
            throw new Error(response.errors)
         }
      } catch (error) {
         console.error(error)
      }
   }

   fetchPitches = async () => {
      const url = apiRoutes.sanBong.getAll
      const queries = {
         pageSize: 1000
      }

      try {
         const response = await apiGet(url, queries)

         if (response && response.data.status === 'SUCCESS') {
            const { data } = response.data.result

            this.setState({ pitches: data })
         } else {
            throw new Error(response.errors)
         }
      } catch (error) {
         console.error(error)
      }
   }

   ///// METHODS FOR COMPUTING VALUES /////

   getAllServices = () => {
      const { services } = this.state
      let allServices = []

      services.forEach(service => {
         allServices.push({
            value: service['maDichVu'],
            label: service['tenDichVu']
         })
      })

      return allServices
   }

   getAllEmployees = () => {
      const { employees } = this.state
      let allEmployees = []

      employees.forEach(employee => {
         allEmployees.push({
            value: employee['maNhanVien'],
            label: employee['tenNhanVien']
         })
      })

      return allEmployees
   }

   getAllCustomers = () => {
      const { customers } = this.state
      let allCustomers = []

      customers.forEach(customer => {
         allCustomers.push({
            value: customer['maKhachHang'],
            label: customer['tenKhachHang']
         })
      })

      return allCustomers
   }

   getAllPitches = () => {
      const { pitches } = this.state
      let allPitches = []

      pitches.forEach(pitch => {
         allPitches.push({
            value: pitch['maSanBong'],
            label: pitch['tenSanBong']
         })
      })

      return allPitches
   }

   ///// METHODS FOR RENDERING UI /////

   renderComponent = () => {
      const {
         getAllCustomers,
         getAllServices,
         getAllEmployees,
         getAllPitches
      } = this
      const { services } = this.state

      const settings = {
         entity: phieuDatSan,
         api: apiRoutes.phieuDatSan,
         sumpriceProp: 'tongTien',
         fields: [
            {
               label: 'M?? phi???u ?????t s??n',
               propForValue: 'maPhieuDatSan',
               type: 'input'
            },
            {
               label: 'Kh??ch h??ng',
               propForValue: 'khachHang.tenKhachHang',
               type: 'input'
            },
            {
               label: 'Nh??n vi??n',
               propForValue: 'nhanVien.tenNhanVien',
               type: 'input'
            },
            {
               label: 'Ng??y l???p h??a ????n',
               propForValue: 'ngayLap',
               type: 'date'
            }
         ],
         details: {
            entity: chiTietPhieuDatSan,
            api: apiRoutes.chiTietPhieuDatSan,
            columns: [
               {
                  label: 'S??n b??ng',
                  propForValue: 'maSanBong',
                  type: 'select',
                  values: getAllPitches(),
                  propForItemValue: 'value',
                  propForItemText: 'label'
               },
               {
                  label: 'Th???i gian b???t ?????u',
                  propForValue: 'thoiGianBatDau',
                  type: 'time'
               },
               {
                  label: 'Th???i gian k???t th??c',
                  propForValue: 'thoiGianKetThuc',
                  type: 'time'
               },
               {
                  label: 'Ng??y ?????t',
                  propForValue: 'ngayDat',
                  type: 'date'
               },
               {
                  label: 'Th??nh ti???n (VN??)',
                  propForValue: 'thanhTien',
                  type: 'number'
               },
               {
                  label: 'S??? ti???n ???? thanh to??n (VN??)',
                  propForValue: 'tienCoc',
                  type: 'number'
               }
            ]
         }
      }

      return <ForViewPage settings={settings} />
   }

   render() {
      const { renderComponent } = this

      return renderComponent()
   }
}

export default PhieuDatSanForView
