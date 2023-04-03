import React, { useEffect, useRef, useState } from 'react'
import {  Steps, Form, Input, Button, Select, message, notification } from 'antd';
import styleNews from './NewsAdd.module.css'
import axios from 'axios';

import draftToMarkdown from 'draftjs-to-markdown';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import NewsEditor from '../../../components/NewsEditor/NewsEditor';
import { PageHeader } from '@ant-design/pro-layout';

// import { useNavigate } from 'react-router-dom';



export default function NewsAdd() {
  const [currentSteps, setCurrentSteps] = useState(0)
  const [categories, setCategories] = useState([])
  const [formInfo, setFormInfo] = useState(null)
  const [contentHtmlInfo, setContentHtmlInfo] = useState('')
  const [contentMarkInfo, setContentMarkInfo] = useState('')
  const [goBack,setGoBack] = useState(true)
  const formRef = useRef(null)
  const [api, contextHolder] = notification.useNotification()
  const User = JSON.parse(localStorage.getItem('token'))

  const handleSave = (auditState) => {
    axios.post('http://localhost:8000/news', {
      ...formInfo,
      content: contentHtmlInfo,
      region: User.region,
      author: User.username,
      roleId: User.roleId,
      auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
    }).then(res => {
      // console.log(contentHtmlInfo)
      // auditState===0? navigate('/news-manage/draft') :navigate('/audit-manage/list') //提交到草稿箱
      api.info({
        message: '通知',
        description: auditState === 0 ? '您可以到草稿箱中查看保存的文章' : '您可以到审核列表中查看待审核的文章',
        placement: 'bottomRight',
      })
      setGoBack(false)
      setCurrentSteps(pre => pre + 1)
    })
  }

  //进度框前进=>{
  const addCurrent = () => {
    if (currentSteps === 0) {
      formRef.current.validateFields().then((val) => {
        setFormInfo(val)
        setCurrentSteps(pre => pre + 1)
      }).catch(() => {
        message.error('输入内容不能为空！')
      })
    }
    else {

      if (contentHtmlInfo === '' || contentMarkInfo === '\n')
        message.error('输入内容不能为空!')
      else {
        // console.log('form信息 ', formInfo)
        // console.log('html信息 ',contentHtmlInfo)
        setCurrentSteps(pre => pre + 1)
      }

    }

  }
  //进度框退回
  const subCurrent = () => {
    setCurrentSteps(pre => pre - 1)
  }
  //得到第二步骤的富文本编辑框的值
  const getContent = (value) => {
    const htmlContent = draftToHtml(convertToRaw(value.getCurrentContent()))
    let mardownContent = draftToMarkdown(convertToRaw(value.getCurrentContent()))
    mardownContent = mardownContent.replaceAll('&nbsp', '')
    mardownContent = mardownContent.replaceAll(';', '')
    setContentHtmlInfo(htmlContent)
    setContentMarkInfo(mardownContent)
  }

  //提交成功后 重新编辑新的一条新闻
  const editOrigin = ()=>{
    setCurrentSteps(0)
    formRef.current.setFieldsValue({ title:'', categoryId:1 })
    setGoBack(true)  //上一步的点击按钮
    setContentHtmlInfo('')
  }
  //获取文章分类
  useEffect(() => {
    axios.get('http://localhost:8000/categories').then((res) => {
      setCategories(res.data)
    })
  }, [])
  return (
    <div>
      {contextHolder}
      <PageHeader
        ghost={false}
        title='撰写新闻'
      />
      <div style={{ padding: "30px 16px" }}>
        <Steps
          current={currentSteps}
          items={[
            {
              title: '基本信息',
              description: "新闻标题 新闻分类"
            },
            {
              title: '新闻内容',
              description: "新闻主体内容",
            },
            {
              title: '新闻提交',
              description: "保存草稿或者提交审核",
            },
          ]}
        />
        <Form
          name="basic"
          ref={formRef}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          style={{ width: '100%', marginTop: '30px', }}
          initialValues={{ 'categoryId': 1 }}
        // onFinish={onFinish}
        >
          <div className={currentSteps === 0 ? '' : styleNews.hiden}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类' }]}
            >
              <Select
                style={{
                  width: '100%',
                }}
                // onChange={(value) => { console.log(`选中了${value}`) }}
                options={categories.map(val => ({ value: val.id, label: val.title }))}
              />
            </Form.Item>
          </div>
          <div className={currentSteps === 1 ? '' : styleNews.hiden}>
            <NewsEditor getContent={getContent} content={contentHtmlInfo}/>
          </div>
          <div className={currentSteps === 2 ? '' : styleNews.hiden}>

          </div>
          {/* 按钮 */}
          <div style={{ marginTop: '50px' }}>
            {
              currentSteps === 2 ? <Button type="primary" style={{ marginRight: '5px' }} onClick={() => handleSave(0)} >保存草稿箱</Button> : ''
            }
            {
              currentSteps === 2 ? <Button type="primary" danger style={{ marginRight: '5px' }} onClick={() => handleSave(1)}>提交审核</Button> : ''
            }
            {
              currentSteps > 0 && goBack? <Button type="primary" onClick={subCurrent} style={{ marginRight: '5px' }}>
                上一步
              </Button> : ''
            }
            {
              !goBack? <Button type="primary" onClick={editOrigin} style={{ marginRight: '5px' }}>
                继续编辑一个新闻
              </Button> : ''
            }
            {
              currentSteps < 2 ? <Button type="primary" onClick={addCurrent} > 下一步
              </Button> : ''
            }
          </div>
        </Form>
      </div>
    </div>
  )
}
