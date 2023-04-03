import React, { useEffect, useRef, useState } from 'react'
import { Steps, Form, Input, Button, Select, message, notification } from 'antd';
import styleNews from './NewsAdd.module.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import draftToMarkdown from 'draftjs-to-markdown';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import NewsEditor from '../../../components/NewsEditor/NewsEditor';
import { PageHeader } from '@ant-design/pro-layout';




export default function NewsUpdate() {
    const [currentSteps, setCurrentSteps] = useState(0)
    const [categories, setCategories] = useState([])
    const [formInfo, setFormInfo] = useState(null)
    const [contentHtmlInfo, setContentHtmlInfo] = useState(null)
    const [contentMarkInfo, setContentMarkInfo] = useState(null)
    const [finshed,setFinshed] = useState(false)
    const { id } = useParams()
    const formRef = useRef(null)
    const [api, contextHolder] = notification.useNotification()


    //获取需要更新新闻信息
    useEffect(() => {
        axios.get(`http://localhost:8000/news/${id}?_expand=category&_expand=role`).then(res => {
            const { title, categoryId,content } = res.data
            formRef.current.setFieldsValue({ title, categoryId })
            setContentHtmlInfo(content)

        })
    }, [id])


    //获取文章分类
    useEffect(() => {
        axios.get('http://localhost:8000/categories').then((res) => {
            setCategories(res.data)
        })
    }, [])
    const handleSave = (auditState) => {
        axios.patch(`http://localhost:8000/news/${id}`, {
            ...formInfo,
            content: contentHtmlInfo,
            auditState,
        }).then(res => {
            // auditState===0? navigate('/news-manage/draft') :navigate('/audit-manage/list') //提交到草稿箱
            api.info({
                message: '通知',
                description: auditState === 0 ? '修改成功，您可以到草稿箱中查看修改后的文章' : '修改成功，您可以到审核列表中查看待审核的文章',
                placement: 'bottomRight',
            })
            setFinshed(true)
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

            if (contentHtmlInfo === null || contentMarkInfo === '\n')
                message.error('输入内容不能为空!')
            else {
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


    return (
        <div>
            {contextHolder}
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title='新闻更新'
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
                            currentSteps === 2 && !finshed ? <Button type="primary" style={{ marginRight: '5px' }} onClick={() => handleSave(0)} >保存草稿箱</Button> : ''
                        }
                        {
                            currentSteps === 2 && !finshed ? <Button type="primary" danger style={{ marginRight: '5px' }} onClick={() => handleSave(1)}>提交审核</Button> : ''
                        }
                        {
                            currentSteps > 0 && !finshed  ? <Button type="primary" onClick={subCurrent} style={{ marginRight: '5px' }}>
                                上一步
                            </Button> : ''
                        }
                        {
                            currentSteps < 2 && !finshed ? <Button type="primary" onClick={addCurrent} > 下一步
                            </Button> : ''
                        }
                    </div>
                </Form>
            </div>

        </div>
    )
}
