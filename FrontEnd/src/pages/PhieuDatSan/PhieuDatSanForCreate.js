import React, { Component } from 'react'
import ForCreatePage from '../../components/ForCreateWithListPage'
import { phieuDatSan, chiTietPhieuDatSan } from '../../entities'
import apiRoutes from '../../routes/apis'
import { apiGet } from '../../utils'

class PhieuDatSanForCreate extends Component {
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
         sumPriceProp: 'tongTien',
         elemPriceProp: 'thanhTien',
         fields: [
            {
               label: 'Kh??ch h??ng',
               propForValue: 'maKhachHang',
               type: 'select',
               values: getAllCustomers(),
               propForItemValue: 'value',
               propForItemText: 'label'
            },
            {
               label: 'Nh??n vi??n',
               propForValue: 'maNhanVien',
               type: 'select',
               values: getAllEmployees(),
               propForItemValue: 'value',
               propForItemText: 'label'
            },
            {
               label: 'Ng??y l???p h??a ????n',
               propForValue: 'ngayLap',
               placeholder: 'Nh???p ng??y l???p phi???u',
               type: 'date',
               validators: [
                  {
                     rule: 'notEmpty',
                     message:
                        'Ng??y l???p phi???u l?? th??ng tin b???t bu???c v?? kh??ng ???????c ????? tr???ng!'
                  }
               ]
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
                  type: 'time',
                  validators: [
                     {
                        rule: 'notEmpty',
                        message:
                           'Th???i gian b???t ?????u l?? th??ng tin b???t bu???c v?? kh??ng ???????c ????? tr???ng!'
                     }
                  ]
               },
               {
                  label: 'Th???i gian k???t th??c',
                  propForValue: 'thoiGianKetThuc',
                  type: 'time',
                  validators: [
                     {
                        rule: 'notEmpty',
                        message:
                           'Th???i gian k???t th??c l?? th??ng tin b???t bu???c v?? kh??ng ???????c ????? tr???ng!'
                     }
                  ]
               },
               {
                  label: 'Ng??y ?????t',
                  propForValue: 'ngayDat',
                  placeholder: 'Nh???p ng??y ?????t s??n',
                  type: 'date',
                  validators: [
                     {
                        rule: 'notEmpty',
                        message:
                           'Ng??y ?????t s??n l?? th??ng tin b???t bu???c v?? kh??ng ???????c ????? tr???ng!'
                     }
                  ]
               },
               {
                  label: 'Th??nh ti???n (VN??)',
                  propForValue: 'thanhTien',
                  type: 'input',
                  validators: [
                     {
                        rule: 'notEmpty',
                        message:
                           'Th??nh ti???n l?? th??ng tin b???t bu???c v?? kh??ng ???????c ????? tr???ng!'
                     }
                  ]
               },
               {
                  label: 'S??? ti???n ???? thanh to??n (VN??)',
                  propForValue: 'tienCoc',
                  type: 'input',
                  validators: [
                     {
                        rule: 'notEmpty',
                        message:
                           'S??? ti???n ???? thanh to??n l?? th??ng tin b???t bu???c v?? kh??ng ???????c ????? tr???ng!'
                     }
                  ]
               }
            ]
         }
      }

      return <ForCreatePage settings={settings} />
   }

   render() {
      const { renderComponent } = this

      return renderComponent()
   }
}

export default PhieuDatSanForCreate
