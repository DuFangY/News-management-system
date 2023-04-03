import React,{forwardRef} from 'react'
import { Form, Input, Select} from 'antd'
export default forwardRef(function UserForm(props,ref) {
  return (
    <Form
      ref={ref}
      layout="vertical"
      name="form_in_modal"
      initialValues={{
        region:props.loginUser.roleId===2?props.loginUser.region:'亚洲',
        roleId:props.loginUser.roleId===2?3:''
    }}
    >
      {/* 用户名 */}
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* 密码 */}
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入添加的用户名密码！',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {/* 区域region */}
      <Form.Item
        name="region"
        label="区域"
        rules={[
          {
            required: true,
          },
        ]}
        
      >
        <Select
          disabled={props.regionDisabled}
          style={{
            width: '100%',
          }}
          options={props.regionList.map(val=>({value:val.value,label:val.text}))}
        />
      </Form.Item>
      {/* 角色 */}
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          style={{
            width: '100%',
          }}
          disabled={props.roleDisabled}
          onChange={(value)=>{
            //超级管理员
            if(value === 1)
            {
              props.setRegionDisabled(true)
              ref.current.setFieldValue("region","全球")
            }
            else
            {
              props.setRegionDisabled(false)
              ref.current.setFieldValue("region","亚洲")

            }
          }}
          options={props.roleList.map(val=>({value:val.id,label:val.roleName}))}
        />
      </Form.Item>
    </Form>

  )
})
