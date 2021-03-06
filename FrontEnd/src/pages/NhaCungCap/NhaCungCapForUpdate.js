import React, { Component } from 'react'
import ForUpdatePage from '../../components/ForUpdatePage'
import { nhaCungCap } from '../../entities'
import apiRoutes from '../../routes/apis'

class NhaCungCapForUpdate extends Component {
   ///// METHODS FOR RENDERING UI /////

   renderComponent = () => {
      const settings = {
         entity: nhaCungCap,
         api: apiRoutes.nhaCungCap,
         fields: [
            {
               label: 'Mã nhà cung cấp',
               propForValue: 'maNhaCungCap',
               type: 'input',
               disabled: true
            },
            {
               label: 'Tên nhà cung cấp',
               propForValue: 'tenNhaCungCap',
               placeholder: 'Nhập tên của nhà cung cấp',
               type: 'input',
               validators: [
                  {
                     rule: 'notEmpty',
                     message:
                        'Tên của nhà cung cấp là thông tin bắt buộc và không được để trống!'
                  }
               ]
            },
            {
               label: 'Số điện thoại',
               propForValue: 'soDienThoai',
               placeholder: 'Nhập số điện thoại của nhà cung cấp',
               type: 'input',
               validators: [
                  {
                     rule: 'isNumeric',
                     message:
                        'Số điện thoại của nhà cung cấp chỉ được bao gồm các chữ số (0-9)!'
                  },
                  {
                     rule: 'notEmpty',
                     message:
                        'Số điện thoại của nhà cung cấp là thông tin bắt buộc và không được để trống!'
                  },
                  {
                     rule: 'isPhoneNumber',
                     message: 'Số điện thoại của nhà cung cấp không hợp lệ!'
                  }
               ]
            },
            {
               label: 'Địa chỉ',
               propForValue: 'diaChi',
               placeholder: 'Nhập địa chỉ của nhà cung cấp',
               type: 'input',
               validators: [
                  {
                     rule: 'notEmpty',
                     message:
                        'Địa chỉ của nhà cung cấp là thông tin bắt buộc và không được để trống!'
                  }
               ]
            },
            {
               label: 'Ghi chú',
               propForValue: 'ghiChu',
               placeholder: 'Nhập ghi chú về nhà cung cấp (nếu có)',
               type: 'input'
            }
         ]
      }

      return <ForUpdatePage settings={settings} />
   }

   render() {
      const { renderComponent } = this

      return renderComponent()
   }
}

export default NhaCungCapForUpdate
